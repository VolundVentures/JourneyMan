// ============================================
// JOURNEYMAN — Core Type Definitions
// ============================================

// Organization (tenant)
export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Human user
export interface User {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  avatarUrl?: string;
  settings: Record<string, unknown>;
  createdAt: string;
}

// Employee status lifecycle
export type EmployeeStatus = 'onboarding' | 'supervised' | 'active' | 'paused' | 'terminated';

// Communication tone
export type CommunicationTone = 'professional' | 'casual' | 'formal';

// Proactivity level
export type ProactivityLevel = 'low' | 'medium' | 'high';

// Autonomy mode
export type AutonomyMode = 'supervised' | 'semi-autonomous' | 'autonomous';

// Employee behavioral configuration
export interface EmployeeConfig {
  communicationTone: CommunicationTone;
  proactivityLevel: ProactivityLevel;
  autonomyMode: AutonomyMode;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  escalationRules: EscalationRule[];
  confidenceThresholds: {
    execute: number;
    recommend: number;
    escalateBelow: number;
  };
  languages: string[];
  priorityHierarchy: string[];
}

export interface EscalationRule {
  trigger: string;
  condition: string;
  action: string;
}

// AI Employee (core entity)
export interface Employee {
  id: string;
  orgId: string;
  name: string;
  roleTitle: string;
  roleTemplateId?: string;
  department: string;
  reportsTo?: string;
  reportsToName?: string;
  status: EmployeeStatus;
  avatarUrl?: string;

  // Identity & Communication
  emailAddress?: string;
  phoneNumber?: string;
  slackUserId?: string;
  teamsUserId?: string;

  // Behavioral Configuration
  config: EmployeeConfig;

  // Performance
  autonomyScore: number;
  tasksCompleted: number;
  escalationRate: number;

  // Timestamps
  hiredAt: string;
  onboardedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Role Template
export interface RoleTemplate {
  id: string;
  name: string;
  slug: string;
  department: string;
  description: string;
  capabilities: Capability[];
  defaultConfig: Partial<EmployeeConfig>;
  defaultIntegrations: string[];
  taskPatterns: TaskPattern[];
  isPublic: boolean;
  createdAt: string;
}

export interface Capability {
  name: string;
  description: string;
  category: string;
}

export interface TaskPattern {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'on_demand' | 'event_triggered';
}

// Task status lifecycle
export type TaskStatus =
  | 'queued'
  | 'planning'
  | 'in_progress'
  | 'awaiting_approval'
  | 'awaiting_input'
  | 'escalated'
  | 'completed'
  | 'failed';

// Task source
export type TaskSource =
  | 'human_assigned'
  | 'event_triggered'
  | 'scheduled'
  | 'proactive'
  | 'employee_handoff';

// Task
export interface Task {
  id: string;
  orgId: string;
  employeeId: string;
  title: string;
  description?: string;
  source: TaskSource;
  sourceRef?: Record<string, unknown>;
  status: TaskStatus;
  priority: number; // 0-100
  confidenceScore?: number;
  plan?: Record<string, unknown>;
  result?: Record<string, unknown>;
  assignedBy?: string;
  assignedByName?: string;
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Message
export interface Message {
  id: string;
  orgId: string;
  employeeId: string;
  channel: 'email' | 'slack' | 'teams' | 'phone' | 'internal';
  direction: 'inbound' | 'outbound';
  threadId?: string;
  fromAddress?: string;
  toAddress?: string;
  subject?: string;
  body: string;
  metadata: Record<string, unknown>;
  taskId?: string;
  createdAt: string;
}

// Approval
export type ApprovalStatus = 'pending' | 'approved' | 'modified' | 'rejected';

export interface Approval {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName?: string;
  employeeRole?: string;
  taskId?: string;
  actionType: string;
  proposedAction: Record<string, unknown>;
  reasoning: string;
  confidenceScore: number;
  context?: Record<string, unknown>;
  status: ApprovalStatus;
  resolvedBy?: string;
  resolutionFeedback?: string;
  resolvedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

// Escalation
export type EscalationUrgency = 'low' | 'medium' | 'high' | 'critical';
export type EscalationStatus = 'open' | 'resolved' | 'dismissed';

export interface Escalation {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName?: string;
  employeeRole?: string;
  taskId?: string;
  reason: string;
  context: Record<string, unknown>;
  recommendation?: string;
  urgency: EscalationUrgency;
  status: EscalationStatus;
  resolvedBy?: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
}

// Knowledge Item
export interface KnowledgeItem {
  id: string;
  orgId: string;
  sourceType: 'upload' | 'sync' | 'manual';
  sourceRef?: string;
  title: string;
  content: string;
  contentHash: string;
  chunkIndex: number;
  metadata: Record<string, unknown>;
  status: 'active' | 'deprecated' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Memory types
export type MemoryEventType = 'interaction' | 'decision' | 'feedback' | 'observation';
export type MemoryCategory = 'preference' | 'pattern' | 'relationship' | 'rule' | 'context';

export interface EpisodicMemory {
  id: string;
  orgId: string;
  employeeId: string;
  eventType: MemoryEventType;
  content: string;
  significanceScore: number;
  sourceRef?: Record<string, unknown>;
  metadata: Record<string, unknown>;
  isArchived: boolean;
  createdAt: string;
}

export interface InstitutionalMemory {
  id: string;
  orgId: string;
  employeeId?: string;
  category: MemoryCategory;
  subject: string;
  content: string;
  confidence: number;
  sourceCount: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Integration
export interface Integration {
  id: string;
  orgId: string;
  employeeId?: string;
  provider: string;
  scopes: string[];
  status: 'active' | 'expired' | 'revoked';
  lastSyncedAt?: string;
  createdAt: string;
}

// Activity feed
export interface ActivityEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  action: string;
  description: string;
  icon: string;
  timestamp: string;
}

// Performance metrics
export interface PerformanceMetrics {
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  tasksCompletedMonth: number;
  autonomousCompletionRate: number;
  escalationRate: number;
  avgResponseTimeMs: number;
  avgResponseTimeP95Ms: number;
  accuracyRate: number;
  managerSatisfactionScore: number;
  costPerTask: number;
}
