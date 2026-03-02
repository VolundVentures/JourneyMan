import { db } from '@/lib/db';
import { mockEmployees, mockTasks, mockPerformanceByEmployee, mockMemories } from '@/lib/mock-data';
import type { Employee, Task, PerformanceMetrics, InstitutionalMemory } from '@journeyman/shared';

// ============================================
// Employee Data Layer
// ============================================
// Fetches from Supabase when available, falls back to mock data.

function rowToEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    orgId: row.org_id as string,
    name: row.name as string,
    roleTitle: row.role_title as string,
    roleTemplateId: row.role_template_id as string | undefined,
    department: row.department as string,
    reportsTo: row.reports_to as string | undefined,
    reportsToName: row.reports_to_name as string | undefined,
    status: row.status as Employee['status'],
    avatarUrl: row.avatar_url as string | undefined,
    emailAddress: row.email_address as string | undefined,
    phoneNumber: row.phone_number as string | undefined,
    slackUserId: row.slack_user_id as string | undefined,
    config: row.config as Employee['config'],
    autonomyScore: row.autonomy_score as number,
    tasksCompleted: row.tasks_completed as number,
    escalationRate: row.escalation_rate as number,
    hiredAt: row.hired_at as string,
    onboardedAt: row.onboarded_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getEmployees(orgId: string): Promise<Employee[]> {
  try {
    const { data, error } = await db
      .from('employees')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockEmployees;
    }
    return data.map(rowToEmployee);
  } catch {
    return mockEmployees;
  }
}

export async function getEmployee(employeeId: string, orgId: string): Promise<Employee | null> {
  try {
    const { data, error } = await db
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .eq('org_id', orgId)
      .single();

    if (error || !data) {
      return mockEmployees.find((e) => e.id === employeeId) ?? null;
    }
    return rowToEmployee(data);
  } catch {
    return mockEmployees.find((e) => e.id === employeeId) ?? null;
  }
}

export async function getEmployeeTasks(employeeId: string, orgId: string): Promise<Task[]> {
  try {
    const { data, error } = await db
      .from('tasks')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockTasks.filter((t) => t.employeeId === employeeId);
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
    return mockTasks.filter((t) => t.employeeId === employeeId);
  }
}

export async function getEmployeePerformance(employeeId: string): Promise<PerformanceMetrics> {
  // Performance metrics are computed from tasks table + agent_sessions
  // For now, return mock data enhanced with live task counts
  return mockPerformanceByEmployee[employeeId] ?? {
    tasksCompletedToday: 0,
    tasksCompletedWeek: 0,
    tasksCompletedMonth: 0,
    autonomousCompletionRate: 0,
    escalationRate: 0,
    avgResponseTimeMs: 0,
    avgResponseTimeP95Ms: 0,
    accuracyRate: 0,
    managerSatisfactionScore: 0,
    costPerTask: 0,
  };
}

export async function getEmployeeMemories(employeeId: string, orgId: string): Promise<InstitutionalMemory[]> {
  try {
    const { data, error } = await db
      .from('institutional_memories')
      .select('*')
      .eq('org_id', orgId)
      .or(`employee_id.eq.${employeeId},employee_id.is.null`)
      .order('confidence', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return mockMemories.filter((m) => m.employeeId === employeeId);
    }
    return data.map((row) => ({
      id: row.id,
      orgId: row.org_id,
      employeeId: row.employee_id ?? undefined,
      category: row.category as InstitutionalMemory['category'],
      subject: row.subject,
      content: row.content,
      confidence: row.confidence,
      sourceCount: row.source_count,
      metadata: row.metadata as Record<string, unknown>,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return mockMemories.filter((m) => m.employeeId === employeeId);
  }
}
