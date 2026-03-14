'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, AlertTriangle, ArrowLeftRight, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { employeeEmojis } from '@/lib/utils';

interface Handoff {
  id: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  taskTitle: string;
  reason: string;
  contextSummary: string;
  status: 'pending' | 'approved' | 'redirected' | 'completed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

const mockHandoffs: Handoff[] = [
  { id: 'ho-1', fromEmployeeId: 'emp-004', fromEmployeeName: 'Sage', toEmployeeId: 'emp-006', toEmployeeName: 'Flux', taskTitle: 'FinTech Market Research → Blog Series', reason: 'Research phase complete, ready for content creation', contextSummary: 'Completed 150-page market analysis covering 5 key FinTech trends. Key findings and data visualizations packaged for Flux to create a 3-part blog series.', status: 'pending', priority: 'medium', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'ho-2', fromEmployeeId: 'emp-003', fromEmployeeName: 'Apex', toEmployeeId: 'emp-002', toEmployeeName: 'Nova', taskTitle: 'Enterprise Deal Handoff — CloudVault', reason: 'Deal progressed to executive negotiation stage', contextSummary: 'CloudVault has moved to enterprise tier negotiation. Deal value: $48K annual. VP expressed interest. Apex has prepared the relationship history, all communications, and pricing discussions.', status: 'pending', priority: 'high', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'ho-3', fromEmployeeId: 'emp-005', fromEmployeeName: 'Ember', toEmployeeId: 'emp-001', toEmployeeName: 'Atlas', taskTitle: 'Ops Process Documentation Update', reason: 'Customer feedback revealed process gap', contextSummary: 'Multiple support tickets indicate confusion about the data migration SOP. Ember documented the recurring issues — Atlas should update the official process docs.', status: 'approved', priority: 'medium', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'ho-4', fromEmployeeId: 'emp-001', fromEmployeeName: 'Atlas', toEmployeeId: 'emp-005', toEmployeeName: 'Ember', taskTitle: 'Vendor Complaint Escalation', reason: 'Vendor issue requires customer-facing communication', contextSummary: 'Vendor delivered wrong components. Atlas has documented the issue and prepared internal notes. Ember should communicate delay to affected customers proactively.', status: 'completed', priority: 'high', createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
];

const statusColors: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50',
  approved: 'text-blue-600 bg-blue-50',
  redirected: 'text-purple-600 bg-purple-50',
  completed: 'text-emerald-600 bg-emerald-50',
};

export default function HandoffsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');

  const filtered = filter === 'all' ? mockHandoffs : mockHandoffs.filter((h) => h.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6" />
            Employee Handoffs
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Work transfers between AI employees requiring manager oversight
          </p>
        </div>
        <Badge variant="outline">{mockHandoffs.filter((h) => h.status === 'pending').length} pending</Badge>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filter === f ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-600'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((handoff) => (
          <Card key={handoff.id} className={cn(
            handoff.status === 'pending' && handoff.priority === 'high' && 'border-amber-200'
          )}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* From → To visual */}
                <div className="flex items-center gap-3 shrink-0 pt-1">
                  <div className="text-center">
                    <span className="text-2xl">{employeeEmojis[handoff.fromEmployeeId]}</span>
                    <p className="text-xs text-neutral-500 mt-1">{handoff.fromEmployeeName}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400" />
                  <div className="text-center">
                    <span className="text-2xl">{employeeEmojis[handoff.toEmployeeId]}</span>
                    <p className="text-xs text-neutral-500 mt-1">{handoff.toEmployeeName}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-neutral-800">{handoff.taskTitle}</h3>
                    <Badge className={statusColors[handoff.status]}>{handoff.status}</Badge>
                    {handoff.priority === 'high' && <Badge variant="destructive" className="text-[10px]">High Priority</Badge>}
                  </div>
                  <p className="text-xs text-neutral-500 mb-2">{handoff.reason}</p>
                  <div className="bg-neutral-100 rounded-lg p-3">
                    <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">Context Package</p>
                    <p className="text-sm text-neutral-600">{handoff.contextSummary}</p>
                  </div>
                </div>

                {/* Actions */}
                {handoff.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm">
                      <CheckCircle className="w-3 h-3" /> Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="w-3 h-3" /> Redirect
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-3 h-3" /> Review
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
