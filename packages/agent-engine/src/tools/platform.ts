// ============================================
// Platform MCP Tools
// ============================================
// Core tools available to every AI employee: task management,
// approvals, escalations, knowledge base, memory, and activity logging.

import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create the platform MCP tool server with Supabase-backed tools.
 */
export function createPlatformToolServer(db: SupabaseClient, context: { orgId: string; employeeId: string }) {
  const { orgId, employeeId } = context;

  const getTaskDetails = tool(
    'get_task_details',
    'Get full details of a task assignment including description, priority, status, and context.',
    { taskId: z.string().describe('The task ID to fetch') },
    async ({ taskId }) => {
      const { data, error } = await db
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('org_id', orgId)
        .single();

      if (error || !data) {
        return { content: [{ type: 'text' as const, text: `Error: Task ${taskId} not found.` }] };
      }
      return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
    },
    { annotations: { readOnly: true } }
  );

  const updateTaskStatus = tool(
    'update_task_status',
    'Update the status of a task. Use this to mark tasks as in_progress, completed, failed, etc.',
    {
      taskId: z.string().describe('The task ID'),
      status: z.enum(['planning', 'in_progress', 'awaiting_approval', 'awaiting_input', 'completed', 'failed']),
      result: z.record(z.unknown()).optional().describe('Result data when completing a task'),
      confidenceScore: z.number().min(0).max(1).optional().describe('Your confidence in this action'),
    },
    async ({ taskId, status, result }) => {
      const update: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (status === 'in_progress') update.started_at = new Date().toISOString();
      if (status === 'completed') {
        update.completed_at = new Date().toISOString();
        if (result) update.result = result;
      }

      const { error } = await db
        .from('tasks')
        .update(update)
        .eq('id', taskId)
        .eq('org_id', orgId);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error updating task: ${error.message}` }] };
      }
      return { content: [{ type: 'text' as const, text: `Task ${taskId} status updated to ${status}.` }] };
    },
    { annotations: { destructive: false } }
  );

  const requestApproval = tool(
    'request_approval',
    'Submit a proposed action for human manager review. Use when your confidence is below the autonomous threshold.',
    {
      actionType: z.string().describe('Type of action (e.g., send_email, calendar_reschedule, crm_update)'),
      proposedAction: z.object({
        summary: z.string().describe('Brief summary of the proposed action'),
        details: z.record(z.unknown()).optional(),
      }),
      reasoning: z.string().describe('Explain why you want to take this action and why you need approval'),
      confidenceScore: z.number().min(0).max(1).describe('Your confidence in this being the right action'),
      taskId: z.string().optional().describe('Related task ID, if any'),
    },
    async ({ actionType, proposedAction, reasoning, confidenceScore, taskId }) => {
      const { data: employee } = await db
        .from('employees')
        .select('name, role_title')
        .eq('id', employeeId)
        .single();

      const { data, error } = await db
        .from('approvals')
        .insert({
          org_id: orgId,
          employee_id: employeeId,
          employee_name: employee?.name,
          employee_role: employee?.role_title,
          task_id: taskId,
          action_type: actionType,
          proposed_action: proposedAction,
          reasoning,
          confidence_score: confidenceScore,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error creating approval: ${error.message}` }] };
      }
      return {
        content: [{
          type: 'text' as const,
          text: `Approval request created (ID: ${data.id}). Your proposed action has been submitted for human review. Continue with other tasks while waiting.`,
        }],
      };
    }
  );

  const escalateToHuman = tool(
    'escalate_to_human',
    'Escalate an issue to a human manager when you cannot handle it confidently or it requires human judgment.',
    {
      reason: z.string().describe('Why this needs human attention'),
      context: z.record(z.unknown()).describe('Relevant context for the human reviewer'),
      recommendation: z.string().optional().describe('Your recommendation, if any'),
      urgency: z.enum(['low', 'medium', 'high', 'critical']),
      taskId: z.string().optional(),
    },
    async ({ reason, context: escContext, recommendation, urgency, taskId }) => {
      const { data: employee } = await db
        .from('employees')
        .select('name, role_title')
        .eq('id', employeeId)
        .single();

      const { data, error } = await db
        .from('escalations')
        .insert({
          org_id: orgId,
          employee_id: employeeId,
          employee_name: employee?.name,
          employee_role: employee?.role_title,
          task_id: taskId,
          reason,
          context: escContext,
          recommendation,
          urgency,
          status: 'open',
        })
        .select('id')
        .single();

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error creating escalation: ${error.message}` }] };
      }

      // Also update the task status if linked
      if (taskId) {
        await db.from('tasks').update({ status: 'escalated', updated_at: new Date().toISOString() }).eq('id', taskId);
      }

      return {
        content: [{
          type: 'text' as const,
          text: `Escalation created (ID: ${data.id}, urgency: ${urgency}). A human manager has been notified.`,
        }],
      };
    }
  );

  const searchKnowledgeBase = tool(
    'search_knowledge_base',
    'Search the organization\'s knowledge base for relevant information, documents, and procedures.',
    {
      query: z.string().describe('Search query'),
      limit: z.number().default(5).describe('Max results to return'),
    },
    async ({ query, limit }) => {
      // Text search on knowledge_items using ilike (full-text search can be added later)
      const { data, error } = await db
        .from('knowledge_items')
        .select('id, title, content, source_type, metadata')
        .eq('org_id', orgId)
        .eq('status', 'active')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error searching: ${error.message}` }] };
      }
      if (!data || data.length === 0) {
        return { content: [{ type: 'text' as const, text: `No knowledge items found matching "${query}".` }] };
      }
      return {
        content: [{
          type: 'text' as const,
          text: `Found ${data.length} results:\n\n${data.map((item) =>
            `### ${item.title}\n(Source: ${item.source_type})\n${item.content.slice(0, 500)}${item.content.length > 500 ? '...' : ''}`
          ).join('\n\n---\n\n')}`,
        }],
      };
    },
    { annotations: { readOnly: true } }
  );

  const recallMemory = tool(
    'recall_memory',
    'Recall relevant past experiences, patterns, preferences, or rules from your memory.',
    {
      query: z.string().describe('What to recall'),
      category: z.enum(['preference', 'pattern', 'relationship', 'rule', 'context']).optional(),
    },
    async ({ query, category }) => {
      let q = db
        .from('institutional_memories')
        .select('category, subject, content, confidence')
        .eq('org_id', orgId)
        .or(`employee_id.eq.${employeeId},employee_id.is.null`)
        .or(`subject.ilike.%${query}%,content.ilike.%${query}%`)
        .order('confidence', { ascending: false })
        .limit(10);

      if (category) {
        q = q.eq('category', category);
      }

      const { data, error } = await q;

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error recalling memory: ${error.message}` }] };
      }
      if (!data || data.length === 0) {
        return { content: [{ type: 'text' as const, text: `No relevant memories found for "${query}".` }] };
      }
      return {
        content: [{
          type: 'text' as const,
          text: data.map((m) =>
            `[${m.category}] ${m.subject} (confidence: ${(m.confidence * 100).toFixed(0)}%)\n${m.content}`
          ).join('\n\n'),
        }],
      };
    },
    { annotations: { readOnly: true } }
  );

  const storeMemory = tool(
    'store_memory',
    'Store a new observation, pattern, or learning for future reference.',
    {
      category: z.enum(['preference', 'pattern', 'relationship', 'rule', 'context']),
      subject: z.string().describe('Brief subject of the memory'),
      content: z.string().describe('Detailed content of the memory'),
      significance: z.number().min(0).max(1).describe('How significant is this? 0.0 = trivial, 1.0 = critical'),
    },
    async ({ category, subject, content, significance }) => {
      // Check if similar memory exists (update instead of duplicate)
      const { data: existing } = await db
        .from('institutional_memories')
        .select('id, source_count')
        .eq('org_id', orgId)
        .eq('employee_id', employeeId)
        .eq('category', category)
        .eq('subject', subject)
        .single();

      if (existing) {
        await db.from('institutional_memories').update({
          content,
          confidence: significance,
          source_count: existing.source_count + 1,
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);
        return { content: [{ type: 'text' as const, text: `Memory updated: [${category}] ${subject}` }] };
      }

      await db.from('institutional_memories').insert({
        org_id: orgId,
        employee_id: employeeId,
        category,
        subject,
        content,
        confidence: significance,
        source_count: 1,
        metadata: {},
      });

      return { content: [{ type: 'text' as const, text: `Memory stored: [${category}] ${subject}` }] };
    }
  );

  const logActivity = tool(
    'log_activity',
    'Log your current activity, reasoning, or decision for the human dashboard. Managers see these in real-time.',
    {
      eventType: z.enum(['action', 'thinking', 'decision', 'communication', 'waiting', 'error']),
      content: z.string().describe('What are you doing or thinking?'),
      confidence: z.number().min(0).max(1).optional(),
      taskId: z.string().optional(),
    },
    async ({ eventType, content, confidence, taskId }) => {
      await db.from('agent_events').insert({
        org_id: orgId,
        employee_id: employeeId,
        task_id: taskId,
        event_type: eventType,
        content,
        confidence,
        metadata: {},
      });

      return { content: [{ type: 'text' as const, text: 'Activity logged.' }] };
    }
  );

  return createSdkMcpServer({
    name: 'journeyman-platform',
    tools: [
      getTaskDetails,
      updateTaskStatus,
      requestApproval,
      escalateToHuman,
      searchKnowledgeBase,
      recallMemory,
      storeMemory,
      logActivity,
    ],
  });
}
