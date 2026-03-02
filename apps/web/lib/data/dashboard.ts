import { db } from '@/lib/db';
import {
  mockEmployees,
  mockTasks,
  mockApprovals,
  mockEscalations,
  mockActivities,
} from '@/lib/mock-data';
import type { Employee, Task, Approval, Escalation, ActivityEntry } from '@journeyman/shared';

// ============================================
// Dashboard Data Layer
// ============================================

export interface DashboardStats {
  activeEmployeeCount: number;
  onboardingCount: number;
  tasksTodayCount: number;
  completedTasksCount: number;
  pendingApprovalsCount: number;
  openEscalationsCount: number;
  totalTaskCount: number;
}

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  try {
    const [empResult, taskResult, approvalResult, escalationResult] = await Promise.all([
      db.from('employees').select('id, status', { count: 'exact' }).eq('org_id', orgId),
      db.from('tasks').select('id, status', { count: 'exact' }).eq('org_id', orgId),
      db.from('approvals').select('id', { count: 'exact' }).eq('org_id', orgId).eq('status', 'pending'),
      db.from('escalations').select('id', { count: 'exact' }).eq('org_id', orgId).eq('status', 'open'),
    ]);

    const employees = empResult.data ?? [];
    const tasks = taskResult.data ?? [];

    if (employees.length === 0 && tasks.length === 0) {
      // Fall back to mock data
      return computeMockStats();
    }

    const activeEmployeeCount = employees.filter((e) => e.status !== 'terminated').length;
    const onboardingCount = employees.filter((e) => e.status === 'onboarding').length;
    const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
    const tasksTodayCount = tasks.filter(
      (t) => t.status === 'completed' || t.status === 'in_progress'
    ).length;

    return {
      activeEmployeeCount,
      onboardingCount,
      tasksTodayCount,
      completedTasksCount,
      pendingApprovalsCount: approvalResult.count ?? 0,
      openEscalationsCount: escalationResult.count ?? 0,
      totalTaskCount: tasks.length,
    };
  } catch {
    return computeMockStats();
  }
}

function computeMockStats(): DashboardStats {
  return {
    activeEmployeeCount: mockEmployees.filter((e) => e.status !== 'terminated').length,
    onboardingCount: mockEmployees.filter((e) => e.status === 'onboarding').length,
    tasksTodayCount: mockTasks.filter((t) => t.status === 'completed' || t.status === 'in_progress').length,
    completedTasksCount: mockTasks.filter((t) => t.status === 'completed').length,
    pendingApprovalsCount: mockApprovals.filter((a) => a.status === 'pending').length,
    openEscalationsCount: mockEscalations.filter((e) => e.status === 'open').length,
    totalTaskCount: mockTasks.length,
  };
}

export async function getRecentActivity(orgId: string, limit = 10): Promise<ActivityEntry[]> {
  try {
    const { data, error } = await db
      .from('agent_events')
      .select('id, employee_id, event_type, content, confidence, metadata, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return mockActivities.slice(0, limit);
    }

    // Fetch employee names for the events
    const employeeIds = [...new Set(data.map((e) => e.employee_id))];
    const { data: employees } = await db
      .from('employees')
      .select('id, name')
      .in('id', employeeIds);

    const nameMap = new Map((employees ?? []).map((e) => [e.id, e.name]));

    return data.map((event) => ({
      id: event.id,
      employeeId: event.employee_id,
      employeeName: nameMap.get(event.employee_id) ?? 'Unknown',
      action: event.event_type,
      description: event.content,
      icon: eventTypeToIcon(event.event_type),
      timestamp: event.created_at,
    }));
  } catch {
    return mockActivities.slice(0, limit);
  }
}

function eventTypeToIcon(eventType: string): string {
  const icons: Record<string, string> = {
    action: 'play',
    thinking: 'brain',
    decision: 'check-circle',
    communication: 'send',
    escalation: 'alert-triangle',
    error: 'alert-octagon',
    waiting: 'clock',
    tool_call: 'wrench',
    tool_result: 'check',
    approval_requested: 'shield',
    task_status_change: 'refresh-cw',
  };
  return icons[eventType] ?? 'activity';
}

export async function getAllTasks(orgId: string): Promise<Task[]> {
  try {
    const { data, error } = await db
      .from('tasks')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockTasks;
    }
    return data.map((row) => ({
      id: row.id,
      orgId: row.org_id,
      employeeId: row.employee_id,
      title: row.title,
      description: row.description ?? undefined,
      source: row.source as Task['source'],
      status: row.status as Task['status'],
      priority: row.priority,
      confidenceScore: row.confidence_score ?? undefined,
      plan: row.plan as Record<string, unknown> | undefined,
      result: row.result as Record<string, unknown> | undefined,
      assignedBy: row.assigned_by ?? undefined,
      assignedByName: row.assigned_by_name ?? undefined,
      dueAt: row.due_at ?? undefined,
      startedAt: row.started_at ?? undefined,
      completedAt: row.completed_at ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return mockTasks;
  }
}

export async function getApprovals(orgId: string, status?: string): Promise<Approval[]> {
  try {
    let q = db
      .from('approvals')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (status) {
      q = q.eq('status', status);
    }

    const { data, error } = await q;

    if (error || !data || data.length === 0) {
      const mocks = status
        ? mockApprovals.filter((a) => a.status === status)
        : mockApprovals;
      return mocks;
    }

    return data.map((row) => ({
      id: row.id,
      orgId: row.org_id,
      employeeId: row.employee_id,
      employeeName: row.employee_name ?? undefined,
      employeeRole: row.employee_role ?? undefined,
      taskId: row.task_id ?? undefined,
      actionType: row.action_type,
      proposedAction: row.proposed_action as Record<string, unknown>,
      reasoning: row.reasoning,
      confidenceScore: row.confidence_score,
      context: row.context as Record<string, unknown> | undefined,
      status: row.status as Approval['status'],
      resolvedBy: row.resolved_by ?? undefined,
      resolutionFeedback: row.resolution_feedback ?? undefined,
      resolvedAt: row.resolved_at ?? undefined,
      expiresAt: row.expires_at ?? undefined,
      createdAt: row.created_at,
    }));
  } catch {
    return status ? mockApprovals.filter((a) => a.status === status) : mockApprovals;
  }
}

export async function getEscalations(orgId: string, status?: string): Promise<Escalation[]> {
  try {
    let q = db
      .from('escalations')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (status) {
      q = q.eq('status', status);
    }

    const { data, error } = await q;

    if (error || !data || data.length === 0) {
      const mocks = status
        ? mockEscalations.filter((e) => e.status === status)
        : mockEscalations;
      return mocks;
    }

    return data.map((row) => ({
      id: row.id,
      orgId: row.org_id,
      employeeId: row.employee_id,
      employeeName: row.employee_name ?? undefined,
      employeeRole: row.employee_role ?? undefined,
      taskId: row.task_id ?? undefined,
      reason: row.reason,
      context: row.context as Record<string, unknown>,
      recommendation: row.recommendation ?? undefined,
      urgency: row.urgency as Escalation['urgency'],
      status: row.status as Escalation['status'],
      resolvedBy: row.resolved_by ?? undefined,
      resolution: row.resolution ?? undefined,
      resolvedAt: row.resolved_at ?? undefined,
      createdAt: row.created_at,
    }));
  } catch {
    return status ? mockEscalations.filter((e) => e.status === status) : mockEscalations;
  }
}
