// ============================================
// Confidence Engine
// ============================================
// Intercepts tool calls with side effects and routes them through
// the confidence-based decision engine: execute, approve, or escalate.

import type { ConfidenceThresholds, ConfidenceDecision } from './types.js';

/**
 * Tools that have side effects (modify external state).
 * These require confidence gating before execution.
 */
const SIDE_EFFECT_TOOLS = new Set([
  'send_email',
  'send_slack_message',
  'update_contact',
  'create_deal',
  'update_task_status',
  'schedule_event',
  'reschedule_event',
  'cancel_event',
]);

/**
 * Tools that are always allowed (read-only operations).
 */
const READ_ONLY_TOOLS = new Set([
  'get_task_details',
  'search_knowledge_base',
  'recall_memory',
  'read_inbox',
  'read_slack_messages',
  'search_contacts',
  'search_companies',
  'check_availability',
  'log_activity',
  'store_memory',
]);

/**
 * Rate limit tracker per employee.
 * In production this would be backed by Redis or a database.
 */
const rateLimitCounters = new Map<string, Map<string, number>>();

function getDailyCounter(employeeId: string, action: string): number {
  const counters = rateLimitCounters.get(employeeId);
  if (!counters) return 0;
  return counters.get(action) ?? 0;
}

function incrementDailyCounter(employeeId: string, action: string): void {
  let counters = rateLimitCounters.get(employeeId);
  if (!counters) {
    counters = new Map();
    rateLimitCounters.set(employeeId, counters);
  }
  counters.set(action, (counters.get(action) ?? 0) + 1);
}

/** Reset daily counters (call at midnight or on schedule) */
export function resetDailyCounters(employeeId?: string): void {
  if (employeeId) {
    rateLimitCounters.delete(employeeId);
  } else {
    rateLimitCounters.clear();
  }
}

/**
 * Evaluate whether a tool call should proceed, require approval, or escalate.
 */
export function evaluateConfidence(params: {
  toolName: string;
  input: Record<string, unknown>;
  thresholds: ConfidenceThresholds;
  employeeId: string;
  limits?: {
    emailsPerDay?: number;
    apiCallsPerDay?: number;
  };
}): ConfidenceDecision {
  const { toolName, input, thresholds, employeeId, limits } = params;

  // Read-only tools always pass
  if (READ_ONLY_TOOLS.has(toolName)) {
    return { action: 'allow' };
  }

  // Check rate limits for specific tools
  if (toolName === 'send_email' && limits?.emailsPerDay) {
    const todayCount = getDailyCounter(employeeId, 'send_email');
    if (todayCount >= limits.emailsPerDay) {
      return {
        action: 'deny',
        reason: `Daily email limit reached (${todayCount}/${limits.emailsPerDay}). Escalate if this is urgent.`,
      };
    }
    incrementDailyCounter(employeeId, 'send_email');
  }

  // For side-effect tools, check confidence
  if (SIDE_EFFECT_TOOLS.has(toolName)) {
    const confidence = typeof input.confidenceScore === 'number'
      ? input.confidenceScore
      : 0.5; // Default if not provided

    if (confidence >= thresholds.execute) {
      return { action: 'allow' };
    }

    if (confidence >= thresholds.recommend) {
      return {
        action: 'request_approval',
        reason: `Confidence ${(confidence * 100).toFixed(0)}% is below autonomous threshold (${(thresholds.execute * 100).toFixed(0)}%). Submitting for human review.`,
      };
    }

    return {
      action: 'escalate',
      reason: `Confidence ${(confidence * 100).toFixed(0)}% is below escalation threshold (${(thresholds.escalateBelow * 100).toFixed(0)}%). This needs human judgment.`,
    };
  }

  // Unknown tools default to allow (they'll be caught by SDK permission system)
  return { action: 'allow' };
}
