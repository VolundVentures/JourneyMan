import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * POST /api/tasks — Create a new task and optionally auto-assign to an employee.
 */
export async function POST(req: Request) {
  const user = await auth();
  if (!user?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, employeeId, priority = 50, dueAt, source = 'human_assigned' } = body;

  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (!employeeId) {
    return NextResponse.json({ error: 'employeeId is required' }, { status: 400 });
  }

  // Verify employee belongs to org
  const { data: employee } = await db
    .from('employees')
    .select('id, name')
    .eq('id', employeeId)
    .eq('org_id', user.orgId)
    .single();

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  // Create the task
  const { data: task, error } = await db
    .from('tasks')
    .insert({
      org_id: user.orgId,
      employee_id: employeeId,
      title,
      description: description ?? null,
      source,
      status: 'queued',
      priority,
      assigned_by: user.id,
      assigned_by_name: user.name,
      due_at: dueAt ?? null,
    })
    .select('id, title, status')
    .single();

  if (error || !task) {
    return NextResponse.json({ error: error?.message ?? 'Failed to create task' }, { status: 500 });
  }

  // Log the task creation as an agent event
  await db.from('agent_events').insert({
    org_id: user.orgId,
    employee_id: employeeId,
    task_id: task.id,
    event_type: 'task_status_change',
    content: `New task assigned: "${title}" by ${user.name ?? 'manager'}`,
    metadata: { taskId: task.id, assignedBy: user.id },
  });

  return NextResponse.json({ task, employeeId, assignedTo: employee.name });
}
