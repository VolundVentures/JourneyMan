import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * SSE endpoint: streams live agent activity events for an employee.
 * The dashboard connects to this for real-time monitoring.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  const user = await auth();
  if (!user?.orgId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { employeeId } = await params;

  // Verify the employee belongs to this org
  const { data: employee } = await db
    .from('employees')
    .select('id')
    .eq('id', employeeId)
    .eq('org_id', user.orgId)
    .single();

  if (!employee) {
    return new Response('Employee not found', { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Subscribe to agent_events via Supabase Realtime
      const channel = db
        .channel(`agent-events-${employeeId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'agent_events',
            filter: `employee_id=eq.${employeeId}`,
          },
          (payload) => {
            try {
              const data = JSON.stringify(payload.new);
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            } catch {
              // Client may have disconnected
            }
          }
        )
        .subscribe();

      // Send initial heartbeat
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', employeeId })}\n\n`));

      // Keep-alive every 30 seconds
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30_000);

      // Cleanup on disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        channel.unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
