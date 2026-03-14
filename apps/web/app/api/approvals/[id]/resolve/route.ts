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
  const { action, feedback } = await req.json();

  if (!action || !['approved', 'rejected', 'modified'].includes(action)) {
    return NextResponse.json(
      { error: 'action must be approved, rejected, or modified' },
      { status: 400 }
    );
  }

  // Update the approval record
  const { error: updateError } = await db
    .from('approvals')
    .update({
      status: action,
      resolved_by: user.id,
      resolution_feedback: feedback ?? null,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', user.orgId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Store manager feedback as institutional memory if provided
  if (feedback) {
    const { data: approval } = await db
      .from('approvals')
      .select('employee_id, action_type, reasoning')
      .eq('id', id)
      .single();

    if (approval) {
      await db.from('institutional_memories').insert({
        org_id: user.orgId,
        employee_id: approval.employee_id,
        category: action === 'rejected' ? 'rule' : 'preference',
        subject: `Approval feedback: ${approval.action_type}`,
        content: `Manager ${action} this action. Feedback: "${feedback}". Original reasoning: ${approval.reasoning}`,
        confidence: 0.9,
        source_count: 1,
        metadata: { approvalId: id, action, resolvedBy: user.id },
      });
    }
  }

  // Log the resolution as an agent event
  const { data: approval } = await db
    .from('approvals')
    .select('employee_id, action_type')
    .eq('id', id)
    .single();

  if (approval) {
    await db.from('agent_events').insert({
      org_id: user.orgId,
      employee_id: approval.employee_id,
      event_type: 'decision',
      content: `Approval ${action} by ${user.name ?? 'manager'}: ${approval.action_type}${feedback ? ` — "${feedback}"` : ''}`,
      metadata: { approvalId: id, action, feedback },
    });
  }

  return NextResponse.json({ success: true, action, id });
}
