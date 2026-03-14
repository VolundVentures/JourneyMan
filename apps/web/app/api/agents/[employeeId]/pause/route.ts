import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getServerOrchestrator } from '@/lib/orchestrator';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  const user = await auth();
  if (!user?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { employeeId } = await params;

  try {
    const orchestrator = getServerOrchestrator();
    await orchestrator.pauseAgent(employeeId);
    return NextResponse.json({ status: 'paused', employeeId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
