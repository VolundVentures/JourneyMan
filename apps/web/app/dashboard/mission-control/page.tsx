'use client';

import { useState } from 'react';
import { Radio, Pause, Play, MessageSquare, Eye, AlertTriangle, CheckCircle, Clock, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockEmployees, mockTasks } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

interface ActivityLine {
  id: string;
  type: 'completed' | 'deciding' | 'escalation' | 'working' | 'thinking';
  text: string;
  time: string;
  confidence?: number;
}

const mockLiveFeeds: Record<string, ActivityLine[]> = {
  'emp-001': [
    { id: '1', type: 'completed', text: 'Sent vendor follow-up email to Acme Corp', time: '10:42:15', confidence: 0.95 },
    { id: '2', type: 'working', text: 'Compiling daily operations status report...', time: '10:42:30' },
    { id: '3', type: 'thinking', text: 'Analyzing 3 data sources for KPI trends', time: '10:42:45', confidence: 0.82 },
    { id: '4', type: 'deciding', text: 'Considering whether to include vendor delay warning...', time: '10:43:01', confidence: 0.68 },
    { id: '5', type: 'completed', text: 'Decision: Include warning with mitigation plan', time: '10:43:15', confidence: 0.78 },
  ],
  'emp-002': [
    { id: '1', type: 'completed', text: 'Prepared meeting agenda for Q1 planning', time: '10:40:00', confidence: 0.92 },
    { id: '2', type: 'working', text: 'Drafting executive briefing for board meeting...', time: '10:41:00' },
    { id: '3', type: 'completed', text: 'Sent calendar invite to 5 stakeholders', time: '10:41:30', confidence: 0.97 },
  ],
  'emp-003': [
    { id: '1', type: 'completed', text: 'Researched prospect: TechForward Inc', time: '10:38:00', confidence: 0.88 },
    { id: '2', type: 'working', text: 'Personalizing outreach email for VP of Engineering...', time: '10:39:00' },
    { id: '3', type: 'escalation', text: 'Prospect mentions competitor pricing — needs manager input', time: '10:40:00', confidence: 0.45 },
  ],
  'emp-004': [
    { id: '1', type: 'working', text: 'Processing 150 data points from industry reports...', time: '10:35:00' },
    { id: '2', type: 'thinking', text: 'Identifying key market trends for FinTech sector', time: '10:38:00', confidence: 0.75 },
  ],
  'emp-005': [
    { id: '1', type: 'completed', text: 'Resolved ticket #4521 — password reset for client', time: '10:41:00', confidence: 0.99 },
    { id: '2', type: 'working', text: 'Responding to customer inquiry about data migration...', time: '10:42:00' },
    { id: '3', type: 'deciding', text: 'Evaluating escalation: client reports data discrepancy', time: '10:42:30', confidence: 0.55 },
  ],
  'emp-006': [
    { id: '1', type: 'completed', text: 'Published social media post on LinkedIn', time: '10:39:00', confidence: 0.91 },
    { id: '2', type: 'working', text: 'Writing blog article: "5 Ways AI Transforms Ops"...', time: '10:40:00' },
  ],
};

const lineColors: Record<string, string> = {
  completed: 'text-emerald-400',
  deciding: 'text-amber-400',
  escalation: 'text-red-400',
  working: 'text-neutral-300',
  thinking: 'text-blue-400',
};

const lineIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle,
  deciding: Clock,
  escalation: AlertTriangle,
  working: Radio,
  thinking: Eye,
};

export default function MissionControlPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [interventionMessage, setInterventionMessage] = useState('');
  const activeEmployees = mockEmployees.filter((e) => e.status === 'active' || e.status === 'supervised');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Radio className="w-6 h-6" />
            Mission Control
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Real-time monitoring of your entire AI workforce
          </p>
        </div>
        <Badge variant="outline" className="animate-pulse-dot text-emerald-400 border-emerald-800">
          LIVE
        </Badge>
      </div>

      {/* Multi-tile view */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {activeEmployees.map((emp) => {
          const emoji = employeeEmojis[emp.id] || '🤖';
          const feed = mockLiveFeeds[emp.id] || [];
          const currentTask = mockTasks.find((t) => t.employeeId === emp.id && t.status === 'in_progress');
          const isSelected = selectedEmployee === emp.id;

          return (
            <Card
              key={emp.id}
              className={cn(
                'cursor-pointer transition-all',
                isSelected ? 'ring-1 ring-neutral-600' : 'hover:border-neutral-700'
              )}
              onClick={() => setSelectedEmployee(isSelected ? null : emp.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{emoji}</span>
                    {emp.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                    <span className="text-[10px] text-neutral-500 uppercase">Active</span>
                  </div>
                </div>
                {currentTask && (
                  <p className="text-xs text-neutral-500 mt-1 truncate">
                    Working on: {currentTask.title}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {/* Terminal-like feed */}
                <div className="bg-neutral-950 rounded-lg p-3 font-mono text-xs space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                  {feed.map((line) => {
                    const Icon = lineIcons[line.type];
                    return (
                      <div key={line.id} className={cn('flex items-start gap-2', lineColors[line.type])}>
                        <span className="text-neutral-600 shrink-0">{line.time}</span>
                        <Icon className="w-3 h-3 mt-0.5 shrink-0" />
                        <span className="flex-1">{line.text}</span>
                        {line.confidence !== undefined && (
                          <span className="text-neutral-600 shrink-0">{Math.round(line.confidence * 100)}%</span>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span className="w-1.5 h-3 bg-neutral-500 animate-blink" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Expanded Employee View with Intervention */}
      {selectedEmployee && (
        <Card className="border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="w-4 h-4" />
              Live View — {mockEmployees.find((e) => e.id === selectedEmployee)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Full Activity Log */}
              <div className="lg:col-span-2">
                <div className="bg-neutral-950 rounded-lg p-4 font-mono text-xs space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                  {(mockLiveFeeds[selectedEmployee] || []).map((line) => {
                    const Icon = lineIcons[line.type];
                    return (
                      <div key={line.id} className={cn('flex items-start gap-2', lineColors[line.type])}>
                        <span className="text-neutral-600 shrink-0 w-16">{line.time}</span>
                        <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <span>{line.text}</span>
                          {line.confidence !== undefined && (
                            <span className="ml-2 text-neutral-600">({Math.round(line.confidence * 100)}% confidence)</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Intervention Panel */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Quick Intervention</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pause className="w-3 h-3" />
                    Pause
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Play className="w-3 h-3" />
                    Resume
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500">Send message to employee:</p>
                  <div className="flex gap-2">
                    <Input
                      value={interventionMessage}
                      onChange={(e) => setInterventionMessage(e.target.value)}
                      placeholder="e.g., mention the SLA clause..."
                      className="text-xs h-8"
                    />
                    <Button size="sm" className="h-8 px-3">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
