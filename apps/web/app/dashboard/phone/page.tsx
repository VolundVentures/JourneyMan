'use client';

import { Phone, PhoneCall, PhoneOff, Mic, Volume2, Clock, Voicemail, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { employeeEmojis } from '@/lib/utils';

interface Call {
  id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  company: string;
  direction: 'inbound' | 'outbound';
  status: 'active' | 'completed' | 'missed' | 'voicemail';
  duration: string;
  startTime: string;
  outcome?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const mockCalls: Call[] = [
  { id: 'call-1', employeeId: 'emp-003', employeeName: 'Apex', contact: 'Marcus Rivera', company: 'TechForward', direction: 'outbound', status: 'active', duration: '4:32', startTime: new Date(Date.now() - 272000).toISOString(), outcome: undefined },
  { id: 'call-2', employeeId: 'emp-005', employeeName: 'Ember', contact: 'Rachel Adams', company: 'GlobalFin', direction: 'inbound', status: 'completed', duration: '12:45', startTime: '2026-02-28T09:30:00Z', outcome: 'Resolved billing inquiry', sentiment: 'positive' },
  { id: 'call-3', employeeId: 'emp-003', employeeName: 'Apex', contact: 'David Kim', company: 'InnovateTech', direction: 'outbound', status: 'completed', duration: '8:20', startTime: '2026-02-28T08:00:00Z', outcome: 'Demo scheduled for next week', sentiment: 'positive' },
  { id: 'call-4', employeeId: 'emp-005', employeeName: 'Ember', contact: 'Tom Chen', company: 'StartupXYZ', direction: 'inbound', status: 'missed', duration: '0:00', startTime: '2026-02-27T16:00:00Z' },
  { id: 'call-5', employeeId: 'emp-003', employeeName: 'Apex', contact: 'Emily Watson', company: 'MedTech', direction: 'outbound', status: 'voicemail', duration: '0:45', startTime: '2026-02-27T14:30:00Z', outcome: 'Left voicemail about Q1 pricing' },
];

const statusColors: Record<string, string> = {
  active: 'text-emerald-600 bg-emerald-50',
  completed: 'text-blue-600 bg-blue-50',
  missed: 'text-red-600 bg-red-50',
  voicemail: 'text-amber-600 bg-amber-50',
};

export default function PhonePage() {
  const activeCalls = mockCalls.filter((c) => c.status === 'active');
  const recentCalls = mockCalls.filter((c) => c.status !== 'active');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <Phone className="w-6 h-6" />
          Phone Management
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Monitor and manage AI employee voice calls
        </p>
      </div>

      {/* Active Calls */}
      {activeCalls.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            Active Calls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCalls.map((call) => (
              <Card key={call.id} className="border-emerald-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl">
                      {employeeEmojis[call.employeeId]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-neutral-800">{call.employeeName}</p>
                        <Badge className={statusColors.active}>Live</Badge>
                      </div>
                      <p className="text-xs text-neutral-500">{call.direction === 'inbound' ? '← From' : '→ To'} {call.contact} ({call.company})</p>
                      <p className="text-lg font-mono text-neutral-700 mt-1">{call.duration}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" title="Listen">
                        <Volume2 className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" title="Whisper">
                        <Mic className="w-3 h-3" />
                      </Button>
                      <Button variant="destructive" size="sm" title="End Call">
                        <PhoneOff className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Call Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center gap-4 py-3 border-b border-neutral-200 last:border-0">
                <span className="text-lg">{employeeEmojis[call.employeeId]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">{call.contact}</span>
                    <span className="text-xs text-neutral-400">{call.company}</span>
                    <Badge className={cn('text-[10px]', statusColors[call.status])}>{call.status}</Badge>
                  </div>
                  {call.outcome && <p className="text-xs text-neutral-500 mt-0.5">{call.outcome}</p>}
                </div>
                <span className="text-xs text-neutral-500">{call.direction === 'inbound' ? '←' : '→'}</span>
                <span className="text-xs font-mono text-neutral-500 w-12 text-right">{call.duration}</span>
                <span className="text-xs text-neutral-400">
                  {new Date(call.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
