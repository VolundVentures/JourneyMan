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

// ============================================
// PERSONALITY & IDENTITY SYSTEM
// ============================================

export interface PersonalityDimensions {
  warmth: number;       // 0-10
  precision: number;    // 0-10
  initiative: number;   // 0-10
  creativity: number;   // 0-10
  directness: number;   // 0-10
  adaptability: number; // 0-10
}

export interface PersonalityOverride {
  context: 'external_client' | 'internal_team' | 'executive' | 'vendor' | 'prospect';
  dimensions: Partial<PersonalityDimensions>;
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'masculine' | 'feminine' | 'neutral';
  accent: string;
  speed: number; // 0.5x - 2x
  sampleUrl: string;
}

export interface PersonalityProfile {
  dimensions: PersonalityDimensions;
  overrides: PersonalityOverride[];
  writingSamples: string[];
  voiceProfileId?: string;
  avatarType: 'emoji' | 'illustration' | 'custom';
  avatarValue: string;
}

// ============================================
// HIRING & ONBOARDING
// ============================================

export interface HiringDraft {
  id: string;
  orgId: string;
  createdBy: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: number;
  roleDescription?: string;
  generatedConfig?: Partial<RoleTemplate>;
  selectedTemplateId?: string;
  employeeName?: string;
  personality?: PersonalityProfile;
  accessConfig?: EmployeeAccessConfig;
  simulationResult?: SimulationResult;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeAccessConfig {
  integrationScopes: IntegrationScope[];
  spendingLimits: SpendingLimit;
  approvalRequired: string[];
}

export interface IntegrationScope {
  integrationId: string;
  permissions: ('read' | 'write' | 'admin')[];
}

export interface SpendingLimit {
  maxApiCallsPerDay: number;
  maxEmailsPerDay: number;
  maxDollarPerAction: number;
  maxMonthlyBudget: number;
}

export interface SimulationResult {
  scenario: string;
  steps: SimulationStep[];
  estimatedConfidence: number;
  escalationPoints: string[];
  totalDurationEstimate: string;
}

export interface SimulationStep {
  order: number;
  action: string;
  reasoning: string;
  confidence: number;
  wouldEscalate: boolean;
}

export interface OnboardingPlan {
  id: string;
  employeeId: string;
  orgId: string;
  steps: OnboardingStep[];
  status: 'in_progress' | 'completed' | 'paused';
  startedAt: string;
  completedAt?: string;
  estimatedCompletionMinutes: number;
}

export type OnboardingStepType =
  | 'knowledge_ingestion'
  | 'integration_test'
  | 'calibration_task'
  | 'style_calibration'
  | 'escalation_test'
  | 'go_live';

export interface OnboardingStep {
  id: string;
  type: OnboardingStepType;
  label: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  data?: Record<string, unknown>;
  feedback?: OnboardingFeedback[];
  completedAt?: string;
}

export interface OnboardingFeedback {
  stepId: string;
  rating: 'positive' | 'negative' | 'neutral';
  comment?: string;
  givenBy: string;
  createdAt: string;
}

// ============================================
// LIVE ACTIVITY MONITORING
// ============================================

export type LiveEventType = 'action' | 'thinking' | 'decision' | 'communication' | 'escalation' | 'error' | 'waiting';

export interface LiveActivityEvent {
  id: string;
  employeeId: string;
  taskId?: string;
  eventType: LiveEventType;
  content: string;
  metadata?: Record<string, unknown>;
  confidence?: number;
  timestamp: string;
}

export interface LiveInterventionMessage {
  id: string;
  employeeId: string;
  taskId?: string;
  fromUserId: string;
  type: 'message' | 'pause' | 'override' | 'threshold_change';
  content: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

// ============================================
// EMPLOYEE COLLABORATION & HANDOFFS
// ============================================

export type HandoffStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Handoff {
  id: string;
  orgId: string;
  taskId: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  reason: string;
  contextPackage: Record<string, unknown>;
  status: HandoffStatus;
  approvedBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CollaborationThread {
  id: string;
  orgId: string;
  taskId: string;
  participantIds: string[];
  messages: CollaborationMessage[];
  createdAt: string;
}

export interface CollaborationMessage {
  id: string;
  threadId: string;
  employeeId: string;
  employeeName: string;
  content: string;
  attachments?: Record<string, unknown>[];
  createdAt: string;
}

// ============================================
// TRAINING & SKILL DEVELOPMENT
// ============================================

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[];
  trainingModuleId?: string;
}

export interface TrainingModule {
  id: string;
  skillId: string;
  name: string;
  steps: TrainingStep[];
  estimatedDurationMinutes: number;
  passingScore: number;
}

export interface TrainingStep {
  id: string;
  type: 'knowledge_review' | 'practice_task' | 'assessment';
  content: Record<string, unknown>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  score?: number;
}

export interface SkillCertification {
  id: string;
  employeeId: string;
  skillId: string;
  skillName: string;
  status: 'pending' | 'certified' | 'expired';
  certifiedBy?: string;
  score: number;
  certifiedAt?: string;
  expiresAt?: string;
}

// ============================================
// PERFORMANCE REVIEWS
// ============================================

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  orgId: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  periodStart: string;
  periodEnd: string;
  overallGrade: string;
  overallScore: number;
  categories: ReviewCategory[];
  narrative: string;
  recommendations: string[];
  managerFeedback?: string;
  goals: ReviewGoal[];
  status: 'draft' | 'published' | 'acknowledged';
  createdAt: string;
}

export interface ReviewCategory {
  name: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  highlights: string[];
  concerns: string[];
}

export interface ReviewGoal {
  id: string;
  description: string;
  targetMetric?: string;
  targetValue?: number;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'achieved' | 'missed';
}

export interface PerformanceImprovementPlan {
  id: string;
  employeeId: string;
  reviewId: string;
  actions: PIPAction[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'terminated';
}

export interface PIPAction {
  description: string;
  type: 'training' | 'supervision_increase' | 'task_restriction' | 'config_change';
  status: 'pending' | 'completed';
}

// ============================================
// PHONE & VOICE
// ============================================

export type PhoneCallStatus = 'ringing' | 'active' | 'on_hold' | 'completed' | 'missed' | 'voicemail';

export interface PhoneCall {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  direction: 'inbound' | 'outbound';
  status: PhoneCallStatus;
  fromNumber: string;
  toNumber: string;
  contactName?: string;
  duration?: number;
  recordingUrl?: string;
  transcriptUrl?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome?: string;
  taskId?: string;
  startedAt: string;
  endedAt?: string;
}

export interface CallRoutingRule {
  id: string;
  orgId: string;
  phoneNumber: string;
  conditions: CallCondition[];
  targetEmployeeId: string;
  fallbackAction: 'voicemail' | 'transfer_human' | 'retry';
  priority: number;
}

export interface CallCondition {
  field: 'caller_id' | 'time_of_day' | 'day_of_week' | 'keyword';
  operator: 'equals' | 'contains' | 'between' | 'in';
  value: string | string[];
}

// ============================================
// COMMAND & CONTROL
// ============================================

export interface OperationalHealth {
  overallScore: number;
  segments: HealthSegment[];
  lastUpdated: string;
}

export interface HealthSegment {
  name: string;
  score: number;
  status: 'healthy' | 'degraded' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
}

export interface DashboardWidget {
  id: string;
  type: 'stat_card' | 'chart' | 'heatmap' | 'feed' | 'health_ring';
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
}

export interface CommandResult {
  id: string;
  category: 'navigation' | 'action' | 'query' | 'recent';
  icon: string;
  label: string;
  description?: string;
  shortcut?: string;
  href?: string;
  action?: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type NotificationType =
  | 'approval_request'
  | 'escalation'
  | 'task_complete'
  | 'status_change'
  | 'system_alert'
  | 'report_ready'
  | 'handoff'
  | 'milestone'
  | 'mention';

export interface Notification {
  id: string;
  orgId: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  actionUrl?: string;
  sourceEmployeeId?: string;
  sourceEmployeeName?: string;
  metadata?: Record<string, unknown>;
  read: boolean;
  archived: boolean;
  snoozedUntil?: string;
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  notificationType: string;
  channels: {
    inApp: boolean;
    email: boolean;
    slack: boolean;
    push: boolean;
  };
  minimumPriority: NotificationPriority;
}

// ============================================
// BATCH OPERATIONS
// ============================================

export interface BatchOperation {
  id: string;
  orgId: string;
  initiatedBy: string;
  targetType: 'employee' | 'task' | 'approval' | 'escalation';
  targetIds: string[];
  action: string;
  params?: Record<string, unknown>;
  status: 'pending' | 'in_progress' | 'completed' | 'partial_failure';
  results: BatchOperationResult[];
  createdAt: string;
  completedAt?: string;
}

export interface BatchOperationResult {
  targetId: string;
  success: boolean;
  error?: string;
}

// ============================================
// TIMELINE & TASK DEPENDENCIES
// ============================================

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: 'blocks' | 'related' | 'handoff';
}

export interface CapacityMetrics {
  employeeId: string;
  employeeName: string;
  date: string;
  totalMinutesAvailable: number;
  totalMinutesAllocated: number;
  utilizationRate: number;
}

// ============================================
// AUDIT LOG
// ============================================

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditLogEntry {
  id: string;
  orgId: string;
  actorType: 'human' | 'ai_employee' | 'system';
  actorId: string;
  actorName: string;
  action: string;
  resourceType: 'employee' | 'task' | 'approval' | 'escalation' | 'knowledge' | 'integration' | 'settings' | 'user';
  resourceId: string;
  resourceName?: string;
  details: Record<string, unknown>;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  severity: AuditSeverity;
  timestamp: string;
}

// ============================================
// COMMUNICATION HUB
// ============================================

export interface MessageThread {
  id: string;
  orgId: string;
  subject?: string;
  participants: ThreadParticipant[];
  employeeIds: string[];
  channels: string[];
  latestMessageAt: string;
  messageCount: number;
  isRead: boolean;
  isFlagged: boolean;
  labels: string[];
  contactId?: string;
  taskId?: string;
  latestPreview?: string;
}

export interface ThreadParticipant {
  type: 'ai_employee' | 'human_user' | 'external_contact';
  id: string;
  name: string;
  email?: string;
}

export interface MessageTemplate {
  id: string;
  orgId: string;
  name: string;
  category: string;
  channels: string[];
  subject?: string;
  body: string;
  variables: TemplateVariable[];
  usageCount: number;
  metrics?: TemplateMetrics;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

export interface TemplateMetrics {
  sendCount: number;
  openRate?: number;
  responseRate?: number;
  avgSentiment?: number;
}

export interface BrandVoiceConfig {
  orgId: string;
  approvedTerms: string[];
  blockedTerms: string[];
  toneGuidelines: string;
  signatures: Record<string, string>;
  legalDisclaimers: Record<string, string>;
  updatedAt: string;
}

// ============================================
// CONTACTS & CRM
// ============================================

export interface Contact {
  id: string;
  orgId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  companyId?: string;
  title?: string;
  labels: string[];
  interactionCount: number;
  lastInteractionAt?: string;
  sentimentScore?: number;
  assignedEmployeeIds: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  orgId: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  contactIds: string[];
  dealValue?: number;
  stage?: string;
  createdAt: string;
}

// ============================================
// ANALYTICS & INTELLIGENCE
// ============================================

export interface AnalyticsSnapshot {
  orgId: string;
  period: string;
  totalTasksCompleted: number;
  totalMessagesProcessed: number;
  avgAutonomyRate: number;
  avgEscalationRate: number;
  humanHoursSaved: number;
  costSavings: number;
  totalCost: number;
  activeEmployees: number;
  overallSatisfaction: number;
}

export interface DepartmentAnalytics {
  department: string;
  employeeCount: number;
  taskVolume: number;
  autonomyRate: number;
  escalationRate: number;
  avgCostPerTask: number;
  topPerformer: string;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AnalyticsFilter {
  dateRange: { start: string; end: string };
  departments?: string[];
  employeeIds?: string[];
  taskTypes?: string[];
}

export interface AIInsight {
  id: string;
  orgId: string;
  type: 'optimization' | 'anomaly' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionLabel?: string;
  actionUrl?: string;
  employeeId?: string;
  createdAt: string;
}

// ============================================
// COST & ROI
// ============================================

export interface CostEntry {
  id: string;
  orgId: string;
  employeeId: string;
  category: 'api_calls' | 'compute' | 'integration' | 'storage' | 'communication';
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  taskId?: string;
}

export interface Budget {
  id: string;
  orgId: string;
  scope: 'organization' | 'department' | 'employee';
  scopeId: string;
  monthlyLimit: number;
  currentSpend: number;
  alertThreshold: number;
  currency: string;
  period: string;
}

export interface ROICalculation {
  period: string;
  totalAICost: number;
  tasksCompleted: number;
  estimatedHumanHours: number;
  humanHourlyCost: number;
  estimatedHumanCost: number;
  netSavings: number;
  roiMultiplier: number;
}

// ============================================
// KNOWLEDGE SYSTEM (Extended)
// ============================================

export interface KnowledgeChunk {
  id: string;
  knowledgeItemId: string;
  content: string;
  chunkIndex: number;
  tokenCount: number;
  accessCount: number;
  lastAccessedAt?: string;
  referencedByTaskIds: string[];
}

export interface KnowledgeIngestionJob {
  id: string;
  orgId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  stages: IngestionStage[];
  status: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'indexing' | 'completed' | 'failed';
  knowledgeItemId?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface IngestionStage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
}

export interface KnowledgeSearchResult {
  chunkId: string;
  content: string;
  relevanceScore: number;
  highlightedContent: string;
  sourceTitle: string;
  sourceId: string;
}

// ============================================
// OPERATING PROCEDURES
// ============================================

export interface ScheduledTask {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description?: string;
  recurrence: RecurrencePattern;
  timezone: string;
  isEnabled: boolean;
  skipHolidays: boolean;
  nextRunAt: string;
  lastRunAt?: string;
  executionCount: number;
  avgDurationMs?: number;
  createdBy: string;
  createdAt: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'cron';
  time?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  cronExpression?: string;
}

export interface ScheduleExecution {
  id: string;
  scheduledTaskId: string;
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  scheduledFor: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface StandardOperatingProcedure {
  id: string;
  orgId: string;
  name: string;
  description: string;
  applicableWhen: string;
  steps: SOPStep[];
  qualityStandards: string[];
  escalationTriggers: string[];
  assignedEmployeeIds: string[];
  version: number;
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SOPStep {
  order: number;
  instruction: string;
  decisionPoints?: string[];
  expectedOutcome: string;
}

export interface SOPComplianceRecord {
  id: string;
  sopId: string;
  employeeId: string;
  taskId: string;
  adherenceScore: number;
  deviations: string[];
  justified: boolean;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  trigger: RuleTrigger;
  conditions: RuleCondition[];
  employeeId: string;
  employeeName: string;
  instruction: string;
  isEnabled: boolean;
  executionCount: number;
  lastTriggeredAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuleTrigger {
  type: 'email_received' | 'task_created' | 'task_completed' | 'escalation_created' |
        'approval_timeout' | 'schedule' | 'webhook' | 'integration_event' | 'employee_status_change';
  config: Record<string, unknown>;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'matches';
  value: string | number | string[];
  logicalOperator?: 'and' | 'or';
}

// ============================================
// SECURITY & GOVERNANCE
// ============================================

export interface Role {
  id: string;
  orgId: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  resource: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'export')[];
  scope?: 'all' | 'department' | 'own';
  departmentId?: string;
}

export interface ApprovalPolicy {
  id: string;
  orgId: string;
  name: string;
  triggerConditions: RuleCondition[];
  approvalChain: ApprovalChainLevel[];
  timeoutMinutes: number;
  timeoutAction: 'escalate' | 'auto_approve' | 'auto_reject';
  isEnabled: boolean;
  createdAt: string;
}

export interface ApprovalChainLevel {
  level: number;
  approverType: 'user' | 'role' | 'department_head';
  approverId?: string;
  approverRole?: string;
  requiredCount: number;
}

export interface Incident {
  id: string;
  orgId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'mitigated' | 'resolved' | 'postmortem_complete';
  employeeId?: string;
  employeeName?: string;
  taskId?: string;
  timeline: IncidentEvent[];
  postmortem?: Postmortem;
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface IncidentEvent {
  timestamp: string;
  description: string;
  actorId: string;
  actorName: string;
}

export interface Postmortem {
  rootCause: string;
  impact: string;
  remediationSteps: string[];
  preventionMeasures: string[];
  completedAt: string;
}

export interface RateLimit {
  employeeId: string;
  limits: {
    apiCallsPerHour: number;
    apiCallsPerDay: number;
    emailsPerHour: number;
    emailsPerDay: number;
    maxCostPerDay: number;
    maxCostPerMonth: number;
  };
  currentUsage: Record<string, number>;
}

// ============================================
// INTEGRATION MARKETPLACE
// ============================================

export interface IntegrationListing {
  id: string;
  provider: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  tags: string[];
  setupTimeMinutes: number;
  requiredScopes: string[];
  features: string[];
  rating?: number;
  reviewCount?: number;
  pricing: 'free' | 'included' | 'premium';
  isPopular: boolean;
  isFeatured: boolean;
}

export interface IntegrationHealthMetrics {
  integrationId: string;
  syncStatus: 'healthy' | 'degraded' | 'failing';
  errorRate: number;
  dataTransferVolume: number;
  lastSync: string;
  recentErrors: IntegrationError[];
}

export interface IntegrationError {
  id: string;
  integrationId: string;
  errorCode: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface APIKey {
  id: string;
  orgId: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  rateLimit: number;
  usageCount: number;
  lastUsedAt?: string;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

// ============================================
// ENTERPRISE & MULTI-ORG
// ============================================

export interface Department {
  id: string;
  orgId: string;
  name: string;
  parentId?: string;
  headUserId?: string;
  headUserName?: string;
  employeeCount: number;
  humanCount: number;
  budget?: Budget;
  createdAt: string;
}

export interface Team {
  id: string;
  orgId: string;
  departmentId: string;
  name: string;
  memberIds: string[];
  leadId?: string;
  leadName?: string;
}

export interface BrandingConfig {
  orgId: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  customDomain?: string;
  emailDomain?: string;
  hidePoweredBy: boolean;
}

// ============================================
// MARKETPLACE
// ============================================

export interface MarketplaceTemplate extends RoleTemplate {
  price: number;
  currency: string;
  creatorId: string;
  creatorName: string;
  installCount: number;
  rating: number;
  reviewCount: number;
  screenshots: string[];
  demoVideoUrl?: string;
}

export interface MarketplaceReview {
  id: string;
  templateId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
