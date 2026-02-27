'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockEscalations, mockEmployees } from '@/lib/mock-data';
import type { Escalation, EscalationUrgency } from '@journeyman/shared';

const urgencyConfig: Record<EscalationUrgency, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  critical: {
    icon: AlertOctagon,
    color: 'text-destructive-400',
    bgColor: 'bg-destructive-500/10',
    borderColor: 'border-destructive-500/30',
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  medium: {
    icon: AlertCircle,
    color: 'text-warning-400',
    bgColor: 'bg-warning-500/10',
    borderColor: 'border-warning-500/30',
  },
  low: {
    icon: Info,
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
    borderColor: 'border-brand-500/30',
  },
};

function EscalationCard({ escalation }: { escalation: Escalation }) {
  const [expanded, setExpanded] = useState(false);
  const [resolved, setResolved] = useState(false);
  const employee = mockEmployees.find((e) => e.id === escalation.employeeId);
  const config = urgencyConfig[escalation.urgency];
  const UrgencyIcon = config.icon;

  if (resolved) return null;

  return (
    <div className={cn(
      'rounded-xl border bg-surface-800/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-surface-800/50',
      config.borderColor
    )}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn('rounded-lg p-2', config.bgColor)}>
            <UrgencyIcon className={cn('w-5 h-5', config.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn(config.bgColor, config.color, 'border', config.borderColor)}>
                {escalation.urgency.toUpperCase()}
              </Badge>
              <span className="text-xs text-surface-500 font-mono">
                {formatRelativeTime(escalation.createdAt)}
              </span>
            </div>
            <h3 className="mt-1.5 font-heading font-semibold text-surface-100">{escalation.reason}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Avatar name={escalation.employeeName || 'AI'} department={employee?.department} size="sm" />
            <div className="text-right">
              <p className="text-sm font-medium text-surface-200">{escalation.employeeName}</p>
              <p className="text-xs text-surface-500">{escalation.employeeRole}</p>
            </div>
          </div>
        </div>

        {/* Context */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-400 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide' : 'View'} full context
        </button>

        {expanded && (
          <div className="rounded-lg bg-surface-900/50 border border-surface-800 p-4 text-sm text-surface-400 animate-fade-in">
            <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(escalation.context, null, 2)}</pre>
          </div>
        )}

        {/* AI Recommendation */}
        {escalation.recommendation && (
          <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 p-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <ArrowRight className="w-3 h-3 text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-brand-400 uppercase tracking-wider font-medium mb-1">AI Recommendation</p>
                <p className="text-sm text-surface-300 leading-relaxed">{escalation.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resolution actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-surface-800/50">
          <Button size="sm" onClick={() => setResolved(true)}>
            <CheckCircle className="w-4 h-4" />
            Resolve with Instructions
          </Button>
          <Button size="sm" variant="outline">
            Take Over
          </Button>
          <Button size="sm" variant="ghost" className="text-surface-500" onClick={() => setResolved(true)}>
            <XCircle className="w-4 h-4" />
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EscalationsPage() {
  const open = mockEscalations
    .filter((e) => e.status === 'open')
    .sort((a, b) => {
      const urgencyOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4);
    });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-surface-50">Escalation Center</h1>
        <p className="mt-1 text-sm text-surface-400">
          {open.length} open escalation{open.length !== 1 ? 's' : ''} requiring attention
        </p>
      </div>

      {open.length > 0 ? (
        <div className="space-y-4">
          {open.map((escalation) => (
            <EscalationCard key={escalation.id} escalation={escalation} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-success-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success-400" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-surface-200 mb-1">No Open Escalations</h3>
          <p className="text-surface-500">Everything is running smoothly.</p>
        </div>
      )}
    </div>
  );
}
