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
  const { taskId } = body;

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const [empResult, taskResult, orgResult] = await Promise.all([
    db.from('employees').select('*').eq('id', employeeId).eq('org_id', user.orgId).single(),
    db.from('tasks').select('*').eq('id', taskId).eq('org_id', user.orgId).single(),
    db.from('organizations').select('*').eq('id', user.orgId).single(),
  ]);

  if (!empResult.data || !taskResult.data || !orgResult.data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const orchestrator = getServerOrchestrator();
    const employee = empResult.data;
    const task = taskResult.data;
    const org = orgResult.data;

    const { sessionId } = await orchestrator.resumeAgent({
      employee: {
        id: employee.id,
        orgId: employee.org_id,
        name: employee.name,
        roleTitle: employee.role_title,
        department: employee.department,
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
    });

    return NextResponse.json({ status: 'resumed', sessionId, employeeId, taskId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
