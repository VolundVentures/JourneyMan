'use client';

import { useParams } from 'next/navigation';
import { Radio, Eye, Pause, Play, Send, ArrowLeft, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockEmployees, mockTasks } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

interface LiveEvent {
  id: string;
  event_type: string;
  content: string;
  confidence: number | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

const typeConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  action: { icon: Play, color: 'text-emerald-600' },
  thinking: { icon: Eye, color: 'text-blue-600' },
  decision: { icon: CheckCircle, color: 'text-emerald-600' },
  communication: { icon: Send, color: 'text-violet-600' },
  escalation: { icon: AlertTriangle, color: 'text-amber-600' },
  error: { icon: AlertTriangle, color: 'text-red-600' },
  waiting: { icon: Clock, color: 'text-neutral-500' },
  tool_call: { icon: Radio, color: 'text-blue-600' },
  tool_result: { icon: CheckCircle, color: 'text-emerald-600' },
  approval_requested: { icon: Clock, color: 'text-amber-600' },
  task_status_change: { icon: CheckCircle, color: 'text-emerald-600' },
};

export default function EmployeeLivePage() {
  const params = useParams();
  const employee = mockEmployees.find((e) => e.id === params.id);
  const [message, setMessage] = useState('');
  const [showThoughts, setShowThoughts] = useState(true);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  const employeeId = params.id as string;

  // Connect to SSE stream
  useEffect(() => {
    const es = new EventSource(`/api/agents/${employeeId}/stream`);

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'connected') {
          setIsConnected(true);
          return;
        }
        setEvents((prev) => [...prev, data as LiveEvent]);
      } catch {
        // Ignore parse errors
      }
    };

    es.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      es.close();
      setIsConnected(false);
    };
  }, [employeeId]);

  // Auto-scroll
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [events]);

  async function handleSendGuidance() {
    if (!message.trim()) return;
    setIsSending(true);
    try {
      await fetch(`/api/agents/${employeeId}/intervene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      setMessage('');
    } catch {
      // Failed to send
    } finally {
      setIsSending(false);
    }
  }

  async function handlePause() {
    try {
      await fetch(`/api/agents/${employeeId}/pause`, { method: 'POST' });
      setIsPaused(true);
    } catch {
      // Failed
    }
  }

  async function handleResume() {
    const currentTask = mockTasks.find((t) => t.employeeId === employeeId && t.status === 'in_progress');
    if (!currentTask) return;
    try {
      await fetch(`/api/agents/${employeeId}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: currentTask.id }),
      });
      setIsPaused(false);
    } catch {
      // Failed
    }
  }

  if (!employee) return <div className="text-neutral-500">Employee not found</div>;

  const emoji = employeeEmojis[employee.id] || '🤖';
  const currentTask = mockTasks.find((t) => t.employeeId === employee.id && t.status === 'in_progress');

  // Combine static mock events with live SSE events
  const staticEvents: LiveEvent[] = [
    { id: 't1', event_type: 'thinking', content: 'Analyzing task requirements...', confidence: null, created_at: '2026-02-27T10:45:01Z', metadata: {} },
    { id: 't2', event_type: 'thinking', content: 'Identified: Follow-up request, medium urgency, pricing question', confidence: 0.88, created_at: '2026-02-27T10:45:03Z', metadata: {} },
    { id: 't3', event_type: 'decision', content: 'Selected customized pricing based on company size (82% confidence)', confidence: 0.82, created_at: '2026-02-27T10:45:06Z', metadata: {} },
    { id: 't4', event_type: 'action', content: 'Drafting personalized pricing email with 3 tier options...', confidence: null, created_at: '2026-02-27T10:45:10Z', metadata: {} },
    { id: 't5', event_type: 'tool_call', content: 'Cross-referencing CRM data for previous interactions', confidence: null, created_at: '2026-02-27T10:45:15Z', metadata: {} },
    { id: 't6', event_type: 'approval_requested', content: 'Draft complete. Submitted for approval (contains pricing > $10K threshold).', confidence: 0.91, created_at: '2026-02-27T10:45:25Z', metadata: {} },
  ];

  const allEvents = [...staticEvents, ...events];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link href={`/dashboard/employees/${employee.id}`} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                {employee.name}
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected ? 'bg-emerald-400 animate-pulse-dot' : 'bg-neutral-300'
                )} />
              </h1>
              <p className="text-sm text-neutral-500">
                {employee.roleTitle} · Live View
                {isConnected && <span className="ml-2 text-emerald-600 text-xs">Connected</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowThoughts(!showThoughts)}>
              <Eye className="w-3 h-3" />
              {showThoughts ? 'Hide' : 'Show'} Thoughts
            </Button>
            {isPaused ? (
              <Button variant="outline" size="sm" onClick={handleResume}>
                <Play className="w-3 h-3" /> Resume
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handlePause}>
                <Pause className="w-3 h-3" /> Pause
              </Button>
            )}
          </div>
        </div>
      </div>

      {currentTask && (
        <Card className="border-neutral-300">
          <CardContent className="py-4 flex items-center gap-3">
            <Badge variant="secondary" className="text-[10px]">Current Task</Badge>
            <span className="text-sm text-neutral-700">{currentTask.title}</span>
            <Badge variant="outline" className="text-[10px]">{currentTask.status}</Badge>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Stream */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Radio className={cn('w-4 h-4', isConnected ? 'text-emerald-600' : 'text-neutral-400')} />
                Live Activity Stream
                {events.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] ml-2">{events.length} live</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={streamRef}
                className="bg-white rounded-lg p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto scrollbar-thin"
              >
                {allEvents.map((event) => {
                  const cfg = typeConfig[event.event_type] || typeConfig.action;
                  const Icon = cfg.icon;
                  const time = new Date(event.created_at).toLocaleTimeString('en-US', { hour12: false });

                  if (!showThoughts && event.event_type === 'thinking') return null;

                  return (
                    <div key={event.id} className={cn('flex items-start gap-2', cfg.color)}>
                      <span className="text-neutral-400 shrink-0 w-16">{time}</span>
                      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span>{event.content}</span>
                        {event.confidence !== null && (
                          <span className="ml-2 text-neutral-400">({Math.round(event.confidence * 100)}%)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 text-neutral-400 mt-2">
                  <span className="w-1.5 h-4 bg-neutral-500 animate-blink" />
                  <span className="text-[10px]">
                    {isPaused ? 'Agent paused. Click Resume to continue.' : 'Waiting for next action...'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intervention Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neutral-500" />
                Quick Intervention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handlePause} disabled={isPaused}>
                  <Pause className="w-3 h-3" /> Pause
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={handleResume} disabled={!isPaused}>
                  <Play className="w-3 h-3" /> Resume
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-neutral-500">Send guidance:</p>
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendGuidance(); }}
                    placeholder="e.g., also mention the data clause"
                    className="text-xs h-8"
                  />
                  <Button size="sm" className="h-8 px-3" onClick={handleSendGuidance} disabled={isSending || !message.trim()}>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <p className="text-xs text-neutral-500">Quick commands:</p>
                {['Redo last action', 'Skip this step', 'Escalate to me'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => { setMessage(cmd); }}
                    className="w-full text-left px-3 py-1.5 rounded text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Connection</span>
                <span className={cn('font-mono', isConnected ? 'text-emerald-600' : 'text-red-500')}>
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Live events</span>
                <span className="text-neutral-700 font-mono">{events.length}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Agent status</span>
                <span className={cn('font-mono', isPaused ? 'text-amber-600' : 'text-emerald-600')}>
                  {isPaused ? 'Paused' : 'Active'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Avg confidence</span>
                <span className="text-neutral-700 font-mono">
                  {allEvents.filter((e) => e.confidence).length > 0
                    ? Math.round(
                        allEvents
                          .filter((e) => e.confidence !== null)
                          .reduce((sum, e) => sum + (e.confidence ?? 0), 0) /
                        allEvents.filter((e) => e.confidence !== null).length * 100
                      ) + '%'
                    : '—'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
