// ============================================
// Orchestrator Singleton for API Routes
// ============================================
// Initializes the agent orchestrator with the server-side Supabase client.

import { getOrchestrator, type AgentOrchestrator } from '@journeyman/agent-engine';
import { db } from '@/lib/db';

let initialized = false;

export function getServerOrchestrator(): AgentOrchestrator {
  if (!initialized) {
    initialized = true;
    return getOrchestrator({
      db: db as Parameters<typeof getOrchestrator>[0] extends undefined ? never : NonNullable<Parameters<typeof getOrchestrator>[0]>['db'],
      defaultModel: 'claude-sonnet-4-6',
      defaultMaxBudgetUsd: 0.50,
      defaultMaxTurns: 50,
    });
  }
  return getOrchestrator();
}
