'use client';

import { Shield, AlertTriangle, Clock, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'mitigated' | 'resolved' | 'postmortem_complete';
  impact: string;
  createdAt: string;
  resolvedAt: string | null;
  assignee: string;
  timeline: { time: string; event: string }[];
}

const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'HubSpot Integration Sync Failure',
    description: 'HubSpot API returning 429 rate limit errors, causing sync failures for lead data.',
    severity: 'high',
    status: 'investigating',
    impact: 'Apex unable to receive new leads for the past 2 hours. Estimated 15 leads missed.',
    createdAt: '2026-02-28T08:00:00Z',
    resolvedAt: null,
    assignee: 'System',
    timeline: [
      { time: '08:00', event: 'Automatic detection: HubSpot sync failed 3 consecutive times' },
      { time: '08:05', event: 'Alert sent to admin team' },
      { time: '08:15', event: 'Investigating: Rate limit exceeded due to bulk import' },
      { time: '08:30', event: 'Mitigation: Reduced sync frequency from 5min to 15min' },
    ],
  },
  {
    id: 'inc-2',
    title: 'Apex Confidence Threshold Anomaly',
    description: 'Apex\'s confidence scores dropped below 50% on 8 consecutive decisions, triggering safety pause.',
    severity: 'medium',
    status: 'mitigated',
    impact: 'Apex auto-paused for 30 minutes. 5 outreach emails delayed.',
    createdAt: '2026-02-27T14:00:00Z',
    resolvedAt: '2026-02-27T14:45:00Z',
    assignee: 'Sara Lindström',
    timeline: [
      { time: '14:00', event: 'Confidence anomaly detected: 8 decisions below 50%' },
      { time: '14:02', event: 'Apex auto-paused (safety protocol)' },
      { time: '14:15', event: 'Root cause: Prospect data was corrupted, leading to low confidence' },
      { time: '14:30', event: 'Data corrected, confidence threshold reset' },
      { time: '14:45', event: 'Apex resumed normal operation' },
    ],
  },
  {
    id: 'inc-3',
    title: 'Email Delivery Bounce Spike',
    description: 'Outbound email bounce rate increased to 15% (normal: 2%) across all AI employees.',
    severity: 'high',
    status: 'resolved',
    impact: 'Approximately 30 emails bounced. Sender reputation temporarily affected.',
    createdAt: '2026-02-25T10:00:00Z',
    resolvedAt: '2026-02-25T12:00:00Z',
    assignee: 'Zakaria Sabti',
    timeline: [
      { time: '10:00', event: 'Anomaly detection: Bounce rate exceeded 10% threshold' },
      { time: '10:15', event: 'Investigation: Identified stale email addresses in contact list' },
      { time: '10:30', event: 'Mitigation: Paused all outbound emails' },
      { time: '11:00', event: 'Resolution: Ran email verification, removed 45 invalid addresses' },
      { time: '12:00', event: 'Resumed outbound emails. Bounce rate returned to 1.8%' },
    ],
  },
];

const severityColors: Record<string, string> = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-amber-600 bg-amber-50 border-amber-200',
  medium: 'text-blue-600 bg-blue-50 border-blue-200',
  low: 'text-neutral-500 bg-neutral-100 border-neutral-300',
};

const statusColors: Record<string, string> = {
  open: 'text-red-600 bg-red-50',
  investigating: 'text-amber-600 bg-amber-50',
  mitigated: 'text-blue-600 bg-blue-50',
  resolved: 'text-emerald-600 bg-emerald-50',
  postmortem_complete: 'text-neutral-500 bg-neutral-100',
};

export default function IncidentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Shield className="w-6 h-6" />
            Incident Management
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track and resolve operational incidents across your AI workforce
          </p>
        </div>
        <Badge variant="outline">
          {mockIncidents.filter((i) => i.status === 'open' || i.status === 'investigating').length} active
        </Badge>
      </div>

      <div className="space-y-4">
        {mockIncidents.map((incident) => (
          <Card key={incident.id} className={cn(
            (incident.status === 'open' || incident.status === 'investigating') && 'border-amber-200'
          )}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className={cn(
                  'w-5 h-5 mt-0.5 shrink-0',
                  incident.severity === 'critical' || incident.severity === 'high' ? 'text-amber-600' : 'text-neutral-500'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-neutral-800">{incident.title}</h3>
                    <Badge className={severityColors[incident.severity]}>{incident.severity}</Badge>
                    <Badge className={statusColors[incident.status]}>{incident.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mb-2">{incident.description}</p>

                  <div className="bg-neutral-100 rounded-lg p-3 mb-3">
                    <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">Impact</p>
                    <p className="text-sm text-neutral-600">{incident.impact}</p>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Timeline</p>
                    {incident.timeline.map((event, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <span className="text-neutral-400 font-mono w-12 shrink-0">{event.time}</span>
                        <div className="relative flex flex-col items-center shrink-0">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            i === incident.timeline.length - 1 ? 'bg-neutral-400' : 'bg-neutral-200'
                          )} />
                          {i < incident.timeline.length - 1 && (
                            <div className="w-px h-4 bg-neutral-100" />
                          )}
                        </div>
                        <span className="text-neutral-500">{event.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {(incident.status === 'open' || incident.status === 'investigating') && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm">Update Status</Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-3 h-3" /> Post-Mortem
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
