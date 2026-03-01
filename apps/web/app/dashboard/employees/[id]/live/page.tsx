'use client';

import { useParams } from 'next/navigation';
import { Radio, Eye, Pause, Play, Send, ArrowLeft, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockEmployees, mockTasks } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

const mockThoughts = [
  { id: 't1', type: 'thinking' as const, text: 'Analyzing client email for intent and urgency...', confidence: null, time: '10:45:01' },
  { id: 't2', type: 'thinking' as const, text: 'Identified: Follow-up request, medium urgency, pricing question', confidence: 0.88, time: '10:45:03' },
  { id: 't3', type: 'deciding' as const, text: 'Considering Option A: Send pricing sheet directly (65% confidence)', confidence: 0.65, time: '10:45:05' },
  { id: 't4', type: 'deciding' as const, text: 'Considering Option B: Customize pricing based on company size (82% confidence)', confidence: 0.82, time: '10:45:06' },
  { id: 't5', type: 'completed' as const, text: 'Selected Option B: Customizing pricing proposal for mid-market tier', confidence: 0.82, time: '10:45:08' },
  { id: 't6', type: 'working' as const, text: 'Drafting personalized pricing email with 3 tier options...', confidence: null, time: '10:45:10' },
  { id: 't7', type: 'working' as const, text: 'Cross-referencing CRM data for previous interactions...', confidence: null, time: '10:45:15' },
  { id: 't8', type: 'completed' as const, text: 'Draft complete. Submitted for approval (contains pricing > $10K threshold).', confidence: 0.91, time: '10:45:25' },
];

const lineColors = {
  completed: 'text-emerald-600',
  deciding: 'text-amber-600',
  thinking: 'text-blue-600',
  working: 'text-neutral-600',
};

const lineIcons = {
  completed: CheckCircle,
  deciding: Clock,
  thinking: Eye,
  working: Radio,
};

export default function EmployeeLivePage() {
  const params = useParams();
  const employee = mockEmployees.find((e) => e.id === params.id);
  const [message, setMessage] = useState('');
  const [showThoughts, setShowThoughts] = useState(true);

  if (!employee) return <div className="text-neutral-500">Employee not found</div>;

  const emoji = employeeEmojis[employee.id] || '🤖';
  const currentTask = mockTasks.find((t) => t.employeeId === employee.id && t.status === 'in_progress');

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
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              </h1>
              <p className="text-sm text-neutral-500">{employee.roleTitle} · Live View</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowThoughts(!showThoughts)}>
              <Eye className="w-3 h-3" />
              {showThoughts ? 'Hide' : 'Show'} Thoughts
            </Button>
            <Button variant="outline" size="sm">
              <Pause className="w-3 h-3" /> Pause
            </Button>
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
                <Radio className="w-4 h-4 text-emerald-600" />
                Live Activity Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                {mockThoughts.map((thought) => {
                  const Icon = lineIcons[thought.type];
                  return (
                    <div key={thought.id} className={cn('flex items-start gap-2', lineColors[thought.type])}>
                      <span className="text-neutral-400 shrink-0 w-16">{thought.time}</span>
                      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span>{thought.text}</span>
                        {thought.confidence !== null && (
                          <span className="ml-2 text-neutral-400">({Math.round(thought.confidence * 100)}%)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 text-neutral-400 mt-2">
                  <span className="w-1.5 h-4 bg-neutral-500 animate-blink" />
                  <span className="text-[10px]">Waiting for next action...</span>
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
                <Button variant="outline" size="sm" className="flex-1">
                  <Pause className="w-3 h-3" /> Pause
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="w-3 h-3" /> Resume
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-neutral-500">Send guidance:</p>
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., also mention the data clause"
                    className="text-xs h-8"
                  />
                  <Button size="sm" className="h-8 px-3">
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <p className="text-xs text-neutral-500">Quick commands:</p>
                {['Redo last action', 'Skip this step', 'Escalate to me'].map((cmd) => (
                  <button key={cmd} className="w-full text-left px-3 py-1.5 rounded text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                    {cmd}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Session duration</span>
                <span className="text-neutral-700 font-mono">2h 34m</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Tasks completed today</span>
                <span className="text-neutral-700 font-mono">7</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Avg confidence</span>
                <span className="text-neutral-700 font-mono">84%</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Escalations today</span>
                <span className="text-neutral-700 font-mono">1</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
