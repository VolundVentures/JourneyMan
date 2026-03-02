import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  try {
    const orchestrator = getServerOrchestrator();
    await orchestrator.intervene(employeeId, message);
    return NextResponse.json({ status: 'sent', employeeId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
