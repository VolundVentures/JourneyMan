'use client';

import { Calendar, Plus, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { employeeEmojis } from '@/lib/utils';

interface ScheduledResponsibility {
  id: string;
  title: string;
  description: string;
  employeeId: string;
  employeeName: string;
  recurrence: string;
  nextRun: string;
  lastRun: string | null;
  lastStatus: 'success' | 'partial' | 'failed' | null;
  timezone: string;
  enabled: boolean;
}

const mockSchedules: ScheduledResponsibility[] = [
  { id: 'sched-1', title: 'Daily Operations Report', description: 'Compile KPIs, identify anomalies, and distribute to stakeholders', employeeId: 'emp-001', employeeName: 'Atlas', recurrence: 'Every weekday at 9:00 AM', nextRun: '2026-03-01T09:00:00Z', lastRun: '2026-02-28T09:00:00Z', lastStatus: 'success', timezone: 'America/New_York', enabled: true },
  { id: 'sched-2', title: 'Vendor Follow-Up', description: 'Check in with vendors on pending deliverables', employeeId: 'emp-001', employeeName: 'Atlas', recurrence: 'Every Monday at 10:00 AM', nextRun: '2026-03-03T10:00:00Z', lastRun: '2026-02-24T10:00:00Z', lastStatus: 'success', timezone: 'America/New_York', enabled: true },
  { id: 'sched-3', title: 'Pipeline Review', description: 'Analyze sales pipeline, update lead scores, flag stale opportunities', employeeId: 'emp-003', employeeName: 'Apex', recurrence: 'Every Tuesday & Thursday at 8:00 AM', nextRun: '2026-03-03T08:00:00Z', lastRun: '2026-02-27T08:00:00Z', lastStatus: 'success', timezone: 'America/New_York', enabled: true },
  { id: 'sched-4', title: 'Weekly Executive Briefing', description: 'Prepare and distribute weekly executive summary', employeeId: 'emp-002', employeeName: 'Nova', recurrence: 'Every Friday at 3:00 PM', nextRun: '2026-03-07T15:00:00Z', lastRun: '2026-02-28T15:00:00Z', lastStatus: 'success', timezone: 'America/New_York', enabled: true },
  { id: 'sched-5', title: 'Customer Satisfaction Check', description: 'Review recent support interactions and send proactive check-ins to at-risk accounts', employeeId: 'emp-005', employeeName: 'Ember', recurrence: 'Every Wednesday at 2:00 PM', nextRun: '2026-03-05T14:00:00Z', lastRun: '2026-02-26T14:00:00Z', lastStatus: 'partial', timezone: 'America/New_York', enabled: true },
  { id: 'sched-6', title: 'Social Media Content Calendar', description: 'Plan and draft next week\'s social media posts', employeeId: 'emp-006', employeeName: 'Flux', recurrence: 'Every Friday at 11:00 AM', nextRun: '2026-03-07T11:00:00Z', lastRun: '2026-02-28T11:00:00Z', lastStatus: 'success', timezone: 'America/New_York', enabled: true },
  { id: 'sched-7', title: 'Market Intelligence Digest', description: 'Compile weekly digest of industry news, competitor moves, and market trends', employeeId: 'emp-004', employeeName: 'Sage', recurrence: 'Every Monday at 7:00 AM', nextRun: '2026-03-03T07:00:00Z', lastRun: '2026-02-24T07:00:00Z', lastStatus: 'success', timezone: 'America/New_York', enabled: true },
];

const statusIcons = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  partial: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  failed: <AlertTriangle className="w-4 h-4 text-red-400" />,
};

export default function SchedulesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            Recurring Responsibilities
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Define your AI employees&apos; recurring duties — like a job description that actually executes
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Responsibility
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockSchedules.map((schedule) => (
          <Card key={schedule.id} className="hover:border-neutral-700 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{employeeEmojis[schedule.employeeId]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-neutral-100">{schedule.title}</h3>
                    {schedule.lastStatus && statusIcons[schedule.lastStatus]}
                  </div>
                  <p className="text-xs text-neutral-500 mb-3">{schedule.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 text-neutral-600" />
                      <span className="text-neutral-400">{schedule.recurrence}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-neutral-600" />
                      <span className="text-neutral-500">
                        Next: {new Date(schedule.nextRun).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600 text-[10px]">Assigned to</span>
                      <Badge variant="secondary" className="text-[10px]">{schedule.employeeName}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
