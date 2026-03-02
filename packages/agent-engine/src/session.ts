// ============================================
// Employee Session
// ============================================
// Wraps a Claude Agent SDK query() for a single AI employee.
// Manages the agent lifecycle, streams events, and integrates
// confidence gating, memory, and tool servers.

import { query, type Query } from '@anthropic-ai/claude-agent-sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Employee, Organization, Task, RoleTemplate } from '@journeyman/shared';
import { buildSystemPrompt } from './prompt-builder.js';
import { evaluateConfidence } from './confidence.js';
import { createPlatformToolServer } from './tools/platform.js';
import { createCommunicationToolServer } from './tools/communication.js';
import { createCrmToolServer } from './tools/crm.js';
import type { AgentEvent, AgentEventListener, MemoryEntry } from './types.js';

export interface EmployeeSessionConfig {
  employee: Employee;
  org: Organization;
  task: Task;
  roleTemplate?: RoleTemplate;
  db: SupabaseClient;
  maxBudgetUsd?: number;
  maxTurns?: number;
  model?: string;
}

export class EmployeeSession {
  private agentQuery: Query | null = null;
  private abortController = new AbortController();
  private listeners: AgentEventListener[] = [];
  private sdkSessionId: string | null = null;
  private sessionRecordId: string | null = null;
  private _isRunning = false;

  readonly employee: Employee;
  readonly org: Organization;
  readonly task: Task;
  private readonly db: SupabaseClient;
  private readonly config: EmployeeSessionConfig;

  constructor(config: EmployeeSessionConfig) {
    this.config = config;
    this.employee = config.employee;
    this.org = config.org;
    this.task = config.task;
    this.db = config.db;
  }

  get isRunning(): boolean {
    return this._isRunning;
  }

  /** Subscribe to agent events */
  onEvent(listener: AgentEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /** Emit an event to all listeners and persist to database */
  private async emitEvent(event: Omit<AgentEvent, 'id' | 'createdAt'>): Promise<void> {
    const fullEvent: AgentEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    // Persist to agent_events table (Supabase Realtime will broadcast)
    await this.db.from('agent_events').insert({
      org_id: fullEvent.orgId,
      employee_id: fullEvent.employeeId,
      task_id: fullEvent.taskId,
      event_type: fullEvent.eventType,
      content: fullEvent.content,
      confidence: fullEvent.confidence,
      metadata: fullEvent.metadata,
    }).then(() => {
      // Notify listeners
      for (const listener of this.listeners) {
        try {
          listener(fullEvent);
        } catch {
          // Don't let listener errors break the session
        }
      }
    });
  }

  /** Load relevant memories for context injection */
  private async loadMemories(): Promise<MemoryEntry[]> {
    const { data } = await this.db
      .from('institutional_memories')
      .select('category, subject, content, confidence')
      .eq('org_id', this.org.id)
      .or(`employee_id.eq.${this.employee.id},employee_id.is.null`)
      .order('confidence', { ascending: false })
      .limit(15);

    return (data ?? []).map((m) => ({
      category: m.category,
      subject: m.subject,
      content: m.content,
      confidence: m.confidence,
    }));
  }

  /** Start the agent session and execute the task */
  async start(): Promise<void> {
    if (this._isRunning) {
      throw new Error(`Session for ${this.employee.name} is already running`);
    }

    this._isRunning = true;
    const { employee, org, task, db } = this;
    const toolContext = { orgId: org.id, employeeId: employee.id };

    // Create session record
    const { data: sessionRecord } = await db.from('agent_sessions').insert({
      org_id: org.id,
      employee_id: employee.id,
      task_id: task.id,
      status: 'active',
    }).select('id').single();
    this.sessionRecordId = sessionRecord?.id ?? null;

    // Emit start event
    await this.emitEvent({
      orgId: org.id,
      employeeId: employee.id,
      taskId: task.id,
      eventType: 'action',
      content: `Starting task: ${task.title}`,
      metadata: { taskId: task.id, taskTitle: task.title },
    });

    // Load context
    const memories = await this.loadMemories();

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      employee,
      org,
      roleTemplate: this.config.roleTemplate,
      memories,
      taskContext: `Task: ${task.title}\n${task.description ?? ''}`,
    });

    // Build task prompt
    const taskPrompt = `Execute the following task:

**${task.title}**
${task.description ? `\nDescription: ${task.description}` : ''}
Priority: ${task.priority}/100
${task.dueAt ? `Due: ${task.dueAt}` : ''}

Steps:
1. First, log your initial plan using log_activity
2. Search the knowledge base for relevant information
3. Recall any relevant memories
4. Execute the task using available tools
5. Log your progress and decisions
6. Update the task status when complete
7. Store any important learnings as memories`;

    // Create MCP tool servers
    const platformServer = createPlatformToolServer(db, toolContext);
    const communicationServer = createCommunicationToolServer(db, toolContext);
    const crmServer = createCrmToolServer(db, { orgId: org.id });

    try {
      // Start the Claude Agent SDK query
      this.agentQuery = query({
        prompt: taskPrompt,
        options: {
          model: this.config.model ?? 'claude-sonnet-4-6',
          systemPrompt,
          abortController: this.abortController,
          maxTurns: this.config.maxTurns ?? 50,
          maxBudgetUsd: this.config.maxBudgetUsd ?? 0.50,
          allowedTools: ['Task'],
          permissionMode: 'bypassPermissions',
          allowDangerouslySkipPermissions: true,
          mcpServers: {
            platform: platformServer,
            communication: communicationServer,
            crm: crmServer,
          },
          agents: {
            researcher: {
              description: 'Deep research specialist. Use for tasks requiring thorough investigation or web search.',
              prompt: `You are a research specialist working for ${employee.name} (${employee.roleTitle}) at ${org.name}. Search knowledge base, analyze data, and return structured findings. Be thorough and cite sources.`,
              tools: ['Read', 'Grep', 'WebSearch', 'WebFetch'],
              model: 'haiku',
              maxTurns: 15,
            },
            writer: {
              description: 'Content and communication drafter. Use for emails, reports, proposals, and messages.',
              prompt: `You are a writing specialist for ${employee.name}. Communication tone: ${employee.config.communicationTone}. Draft content matching the employee's voice. Be concise and professional.`,
              tools: ['Read', 'Grep'],
              model: 'sonnet',
              maxTurns: 10,
            },
            analyzer: {
              description: 'Data analysis specialist. Use for metrics, trends, comparisons, and quantitative tasks.',
              prompt: `You are a data analyst supporting ${employee.name}. Analyze data and return structured insights with confidence scores. Use tables and clear formatting.`,
              tools: ['Read', 'Grep', 'Bash'],
              model: 'haiku',
              maxTurns: 10,
            },
          },
          canUseTool: async (toolName, input) => {
            const decision = evaluateConfidence({
              toolName,
              input: input as Record<string, unknown>,
              thresholds: employee.config.confidenceThresholds,
              employeeId: employee.id,
            });

            if (decision.action === 'allow') {
              return { behavior: 'allow' };
            }

            // Log the blocked action
            await this.emitEvent({
              orgId: org.id,
              employeeId: employee.id,
              taskId: task.id,
              eventType: decision.action === 'request_approval' ? 'approval_requested' : 'escalation',
              content: `${decision.action === 'request_approval' ? 'Approval requested' : 'Escalated'}: ${toolName} — ${decision.reason}`,
              metadata: { toolName, decision: decision.action },
            });

            return {
              behavior: 'deny',
              message: decision.reason,
            };
          },
          hooks: {
            PostToolUse: [{
              hooks: [async (hookInput) => {
                const toolInput = hookInput as Record<string, unknown>;
                const toolName = toolInput.tool_name as string;
                const toolResponse = toolInput.tool_response;
                // Log tool usage
                await this.emitEvent({
                  orgId: org.id,
                  employeeId: employee.id,
                  taskId: task.id,
                  eventType: 'tool_result',
                  content: `Tool ${toolName} completed`,
                  metadata: {
                    toolName,
                    responsePreview: typeof toolResponse === 'string'
                      ? toolResponse.slice(0, 200)
                      : JSON.stringify(toolResponse).slice(0, 200),
                  },
                });
                return {};
              }],
            }],
            Stop: [{
              hooks: [async () => {
                await this.emitEvent({
                  orgId: org.id,
                  employeeId: employee.id,
                  taskId: task.id,
                  eventType: 'action',
                  content: `Task execution completed: ${task.title}`,
                  metadata: { status: 'completed' },
                });
                return {};
              }],
            }],
          },
        },
      });

      // Process messages from the agent
      let resultData: Record<string, unknown> = {};

      for await (const message of this.agentQuery) {
        if ('type' in message && message.type === 'system' && 'subtype' in message && message.subtype === 'init') {
          this.sdkSessionId = (message as Record<string, unknown>).session_id as string;
          // Update session record with SDK session ID
          if (this.sessionRecordId) {
            await db.from('agent_sessions').update({
              sdk_session_id: this.sdkSessionId,
            }).eq('id', this.sessionRecordId);
          }
        }

        if ('type' in message && message.type === 'result') {
          const result = message as Record<string, unknown>;
          resultData = {
            subtype: result.subtype,
            result: result.result,
            totalCostUsd: result.total_cost_usd,
            numTurns: result.num_turns,
            durationMs: result.duration_ms,
          };
        }
      }

      // Session completed successfully
      if (this.sessionRecordId) {
        await db.from('agent_sessions').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_cost_usd: (resultData.totalCostUsd as number) ?? 0,
          turns_used: (resultData.numTurns as number) ?? 0,
        }).eq('id', this.sessionRecordId);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      await this.emitEvent({
        orgId: org.id,
        employeeId: employee.id,
        taskId: task.id,
        eventType: 'error',
        content: `Agent error: ${errorMsg}`,
        metadata: { error: errorMsg },
      });

      if (this.sessionRecordId) {
        await db.from('agent_sessions').update({
          status: 'failed',
          completed_at: new Date().toISOString(),
        }).eq('id', this.sessionRecordId);
      }
    } finally {
      this._isRunning = false;
    }
  }

  /** Pause agent execution */
  async pause(): Promise<void> {
    if (!this._isRunning) return;
    this.abortController.abort();
    this._isRunning = false;

    if (this.sessionRecordId) {
      await this.db.from('agent_sessions').update({ status: 'paused' }).eq('id', this.sessionRecordId);
    }

    await this.emitEvent({
      orgId: this.org.id,
      employeeId: this.employee.id,
      taskId: this.task.id,
      eventType: 'action',
      content: 'Agent paused by manager',
      metadata: { action: 'pause' },
    });
  }

  /** Send intervention message to the agent */
  async intervene(message: string): Promise<void> {
    await this.emitEvent({
      orgId: this.org.id,
      employeeId: this.employee.id,
      taskId: this.task.id,
      eventType: 'action',
      content: `Manager intervention: ${message}`,
      metadata: { type: 'intervention', message },
    });

    // If the agent supports streaming input, we could inject the message
    // For now, intervention is logged and visible in the activity feed
  }

  /** Clean up resources */
  close(): void {
    if (this.agentQuery) {
      this.agentQuery.close();
    }
    this.abortController.abort();
    this._isRunning = false;
    this.listeners = [];
  }
}
