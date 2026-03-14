import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerOrchestrator } from '@/lib/orchestrator';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  const user = await auth();
  if (!user?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { employeeId } = await params;
  const body = await req.json();
  const { taskId, maxBudgetUsd, maxTurns, model } = body;

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  // Load employee, task, and org
  const [empResult, taskResult, orgResult] = await Promise.all([
    db.from('employees').select('*').eq('id', employeeId).eq('org_id', user.orgId).single(),
    db.from('tasks').select('*').eq('id', taskId).eq('org_id', user.orgId).single(),
    db.from('organizations').select('*').eq('id', user.orgId).single(),
  ]);

  if (!empResult.data) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }
  if (!taskResult.data) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  if (!orgResult.data) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  const employee = empResult.data;
  const task = taskResult.data;
  const org = orgResult.data;

  try {
    const orchestrator = getServerOrchestrator();
    const { sessionId } = await orchestrator.executeTask({
      employee: {
        id: employee.id,
        orgId: employee.org_id,
        name: employee.name,
        roleTitle: employee.role_title,
        department: employee.department,
        reportsTo: employee.reports_to ?? undefined,
        reportsToName: employee.reports_to_name ?? undefined,
        status: employee.status as 'active',
        config: employee.config as any,
        autonomyScore: employee.autonomy_score,
        tasksCompleted: employee.tasks_completed,
        escalationRate: employee.escalation_rate,
        hiredAt: employee.hired_at,
        createdAt: employee.created_at,
        updatedAt: employee.updated_at,
      },
      task: {
        id: task.id,
        orgId: task.org_id,
        employeeId: task.employee_id,
        title: task.title,
        description: task.description ?? undefined,
        source: task.source as 'human_assigned',
        status: task.status as 'queued',
        priority: task.priority,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      },
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan as 'starter',
        settings: (org.settings ?? {}) as Record<string, unknown>,
        createdAt: org.created_at,
        updatedAt: org.updated_at,
      },
      maxBudgetUsd,
      maxTurns,
      model,
    });

    return NextResponse.json({ status: 'started', sessionId, employeeId, taskId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
