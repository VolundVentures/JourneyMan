// ============================================
// Agent Orchestrator
// ============================================
// Manages all active agent sessions across the organization.
// Routes tasks to the right employee, handles lifecycle
// (create/pause/resume/terminate), and provides activity streams.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Employee, Organization, Task, RoleTemplate } from '@journeyman/shared';
import { EmployeeSession } from './session.js';
import type { AgentEvent, AgentEventListener } from './types.js';

export interface OrchestratorConfig {
  db: SupabaseClient;
  defaultModel?: string;
  defaultMaxBudgetUsd?: number;
  defaultMaxTurns?: number;
}

export class AgentOrchestrator {
  private sessions = new Map<string, EmployeeSession>();
  private globalListeners: AgentEventListener[] = [];
  private readonly db: SupabaseClient;
  private readonly config: OrchestratorConfig;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.db = config.db;
  }

  /**
   * Start a task execution for an employee.
   * Creates a new EmployeeSession and begins the agent loop.
   */
  async executeTask(params: {
    employee: Employee;
    task: Task;
    org: Organization;
    roleTemplate?: RoleTemplate;
    maxBudgetUsd?: number;
    maxTurns?: number;
    model?: string;
  }): Promise<{ sessionId: string }> {
    const { employee, task, org, roleTemplate, maxBudgetUsd, maxTurns, model } = params;

    // Check if employee already has an active session
    const existing = this.sessions.get(employee.id);
    if (existing?.isRunning) {
      throw new Error(`Employee ${employee.name} already has an active session. Pause it first.`);
    }

    // Create new session
    const session = new EmployeeSession({
      employee,
      task,
      org,
      roleTemplate,
      db: this.db,
      maxBudgetUsd: maxBudgetUsd ?? this.config.defaultMaxBudgetUsd ?? 0.50,
      maxTurns: maxTurns ?? this.config.defaultMaxTurns ?? 50,
      model: model ?? this.config.defaultModel ?? 'claude-sonnet-4-6',
    });

    // Forward events to global listeners
    session.onEvent((event) => {
      for (const listener of this.globalListeners) {
        try {
          listener(event);
        } catch {
          // Ignore listener errors
        }
      }
    });

    this.sessions.set(employee.id, session);

    // Update task status to in_progress
    await this.db.from('tasks').update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', task.id);

    // Start session (non-blocking)
    session.start().catch((error) => {
      console.error(`[Orchestrator] Session error for ${employee.name}:`, error);
    });

    return { sessionId: employee.id };
  }

  /**
   * Send a guidance message to a running agent.
   */
  async intervene(employeeId: string, message: string): Promise<void> {
    const session = this.sessions.get(employeeId);
    if (!session?.isRunning) {
      throw new Error(`No active session found for employee ${employeeId}`);
    }
    await session.intervene(message);
  }

  /**
   * Pause an agent's execution.
   */
  async pauseAgent(employeeId: string): Promise<void> {
    const session = this.sessions.get(employeeId);
    if (!session?.isRunning) {
      throw new Error(`No active session found for employee ${employeeId}`);
    }
    await session.pause();
  }

  /**
   * Resume a paused agent with a new task or the same task.
   */
  async resumeAgent(params: {
    employee: Employee;
    task: Task;
    org: Organization;
    roleTemplate?: RoleTemplate;
  }): Promise<{ sessionId: string }> {
    // Clean up old session
    const existing = this.sessions.get(params.employee.id);
    if (existing) {
      existing.close();
      this.sessions.delete(params.employee.id);
    }

    // Start fresh
    return this.executeTask(params);
  }

  /**
   * Terminate an agent session completely.
   */
  async terminateAgent(employeeId: string): Promise<void> {
    const session = this.sessions.get(employeeId);
    if (session) {
      session.close();
      this.sessions.delete(employeeId);
    }
  }

  /**
   * Check if an employee has an active session.
   */
  isActive(employeeId: string): boolean {
    const session = this.sessions.get(employeeId);
    return session?.isRunning ?? false;
  }

  /**
   * Get the status of all active sessions.
   */
  getActiveSessions(): Array<{ employeeId: string; taskTitle: string; isRunning: boolean }> {
    return Array.from(this.sessions.entries()).map(([employeeId, session]) => ({
      employeeId,
      taskTitle: session.task.title,
      isRunning: session.isRunning,
    }));
  }

  /**
   * Subscribe to events from all agent sessions.
   */
  onEvent(listener: AgentEventListener): () => void {
    this.globalListeners.push(listener);
    return () => {
      this.globalListeners = this.globalListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Shut down all sessions gracefully.
   */
  async shutdown(): Promise<void> {
    for (const [, session] of this.sessions) {
      session.close();
    }
    this.sessions.clear();
    this.globalListeners = [];
  }
}

// Singleton orchestrator factory
let _instance: AgentOrchestrator | null = null;

/**
 * Get or create the singleton orchestrator instance.
 */
export function getOrchestrator(config?: OrchestratorConfig): AgentOrchestrator {
  if (!_instance && config) {
    _instance = new AgentOrchestrator(config);
  }
  if (!_instance) {
    throw new Error('Orchestrator not initialized. Call getOrchestrator with config first.');
  }
  return _instance;
}
