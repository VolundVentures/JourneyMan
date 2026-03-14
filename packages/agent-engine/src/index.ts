// ============================================
// @journeyman/agent-engine — Public API
// ============================================

// Core orchestration
export { AgentOrchestrator, getOrchestrator } from './orchestrator.js';
export type { OrchestratorConfig } from './orchestrator.js';

// Employee session
export { EmployeeSession } from './session.js';
export type { EmployeeSessionConfig } from './session.js';

// Prompt construction
export { buildSystemPrompt, personalityToInstructions } from './prompt-builder.js';

// Confidence engine
export { evaluateConfidence, resetDailyCounters } from './confidence.js';

// Tool server factories
export { createPlatformToolServer } from './tools/platform.js';
export { createCommunicationToolServer } from './tools/communication.js';
export { createCrmToolServer } from './tools/crm.js';

// Types
export type {
  AgentEvent,
  AgentEventType,
  AgentEventListener,
  AgentSessionRecord,
  AgentSessionStatus,
  ConfidenceDecision,
  ConfidenceThresholds,
  ExecuteTaskOptions,
  MemoryEntry,
} from './types.js';
