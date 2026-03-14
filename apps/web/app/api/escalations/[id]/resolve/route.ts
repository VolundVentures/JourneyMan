import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await auth();
  if (!user?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { action, resolution } = await req.json();

  if (!action || !['resolved', 'dismissed'].includes(action)) {
    return NextResponse.json(
      { error: 'action must be resolved or dismissed' },
      { status: 400 }
    );
  }

  const { error: updateError } = await db
    .from('escalations')
    .update({
      status: action,
      resolved_by: user.id,
      resolution: resolution ?? null,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', user.orgId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Store resolution as institutional memory
  if (resolution) {
    const { data: escalation } = await db
      .from('escalations')
      .select('employee_id, reason')
      .eq('id', id)
      .single();

    if (escalation) {
      await db.from('institutional_memories').insert({
        org_id: user.orgId,
        employee_id: escalation.employee_id,
        category: 'rule',
        subject: `Escalation resolution: ${escalation.reason.slice(0, 100)}`,
        content: `Manager resolved escalation. Resolution: "${resolution}". Original reason: ${escalation.reason}`,
        confidence: 0.85,
        source_count: 1,
        metadata: { escalationId: id, action, resolvedBy: user.id },
      });
    }
  }

  // Log the resolution as an agent event
  const { data: escalation } = await db
    .from('escalations')
    .select('employee_id, reason')
    .eq('id', id)
    .single();

  if (escalation) {
    await db.from('agent_events').insert({
      org_id: user.orgId,
      employee_id: escalation.employee_id,
      event_type: 'decision',
      content: `Escalation ${action} by ${user.name ?? 'manager'}${resolution ? `: "${resolution}"` : ''}`,
      metadata: { escalationId: id, action, resolution },
    });
  }

  return NextResponse.json({ success: true, action, id });
}
