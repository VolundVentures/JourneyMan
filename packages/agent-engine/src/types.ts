// ============================================
// Agent Engine — Internal Types
// ============================================

import type { Employee, Organization, Task, RoleTemplate } from '@journeyman/shared';

/** Status of an agent session */
export type AgentSessionStatus = 'active' | 'paused' | 'completed' | 'failed';

/** Event types emitted during agent execution */
export type AgentEventType =
  | 'action'
  | 'thinking'
  | 'decision'
  | 'communication'
  | 'escalation'
  | 'error'
  | 'waiting'
  | 'tool_call'
  | 'tool_result'
  | 'approval_requested'
  | 'task_status_change';

/** An event emitted by an agent during execution */
export interface AgentEvent {
  id: string;
  orgId: string;
  employeeId: string;
  taskId?: string;
  eventType: AgentEventType;
  content: string;
  confidence?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

/** Stored agent session record */
export interface AgentSessionRecord {
  id: string;
  orgId: string;
  employeeId: string;
  taskId?: string;
  sdkSessionId?: string;
  status: AgentSessionStatus;
  startedAt: string;
  completedAt?: string;
  totalCostUsd: number;
  turnsUsed: number;
}

/** Options for starting an agent task execution */
export interface ExecuteTaskOptions {
  employee: Employee;
  task: Task;
  org: Organization;
  roleTemplate?: RoleTemplate;
  maxBudgetUsd?: number;
  maxTurns?: number;
  model?: string;
}

/** Options for the confidence engine */
export interface ConfidenceThresholds {
  /** Score at or above which the agent executes autonomously */
  execute: number;
  /** Score at or above which the agent requests approval */
  recommend: number;
  /** Score below which the agent escalates to human */
  escalateBelow: number;
}

/** Result of a confidence evaluation */
export type ConfidenceDecision =
  | { action: 'allow' }
  | { action: 'request_approval'; reason: string }
  | { action: 'escalate'; reason: string }
  | { action: 'deny'; reason: string };

/** Memory entry for injection into agent context */
export interface MemoryEntry {
  category: string;
  subject: string;
  content: string;
  confidence: number;
}

/** Listener for agent events */
export type AgentEventListener = (event: AgentEvent) => void | Promise<void>;
