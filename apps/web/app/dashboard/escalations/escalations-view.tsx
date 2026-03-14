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
import { cn, formatRelativeTime, employeeEmojis } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Escalation, EscalationUrgency, Employee } from '@journeyman/shared';

const urgencyConfig: Record<EscalationUrgency, { icon: React.ElementType; label: string }> = {
  critical: { icon: AlertOctagon, label: 'CRITICAL' },
  high: { icon: AlertTriangle, label: 'HIGH' },
  medium: { icon: AlertCircle, label: 'MEDIUM' },
  low: { icon: Info, label: 'LOW' },
};

function EscalationCard({
  escalation,
  onResolve,
}: {
  escalation: Escalation;
  onResolve: (id: string, action: string, resolution?: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [showResolution, setShowResolution] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const config = urgencyConfig[escalation.urgency];
  const UrgencyIcon = config.icon;
  const emoji = employeeEmojis[escalation.employeeId];

  async function handleResolve(action: string) {
    setIsResolving(true);
    try {
      await onResolve(escalation.id, action, resolutionText || undefined);
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden transition-colors hover:border-neutral-300">
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg p-2 bg-neutral-100">
            <UrgencyIcon className="w-5 h-5 text-neutral-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={escalation.urgency === 'critical' ? 'destructive' : escalation.urgency === 'high' ? 'warning' : 'default'}>
                {config.label}
              </Badge>
              <span className="text-xs text-neutral-500 font-mono">
                {formatRelativeTime(escalation.createdAt)}
              </span>
            </div>
            <h3 className="mt-1.5 font-semibold text-neutral-800">{escalation.reason}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Avatar name={escalation.employeeName || 'AI'} emoji={emoji} size="sm" />
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-700">{escalation.employeeName}</p>
              <p className="text-xs text-neutral-500">{escalation.employeeRole}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-600 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide' : 'View'} full context
        </button>

        {expanded && (
          <div className="rounded-lg bg-white border border-neutral-200 p-4 text-sm text-neutral-500 animate-fade-in">
            <pre className="whitespace-pre-wrap font-mono text-xs">{JSON.stringify(escalation.context, null, 2)}</pre>
          </div>
        )}

        {escalation.recommendation && (
          <div className="rounded-lg border border-neutral-300 bg-neutral-100 p-4">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                <ArrowRight className="w-3 h-3 text-neutral-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">AI Recommendation</p>
                <p className="text-sm text-neutral-600 leading-relaxed">{escalation.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {showResolution && (
          <div className="animate-fade-in">
            <textarea
              placeholder="Add resolution instructions for the AI employee..."
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
              rows={2}
            />
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
          <Button size="sm" disabled={isResolving} onClick={() => {
            if (!showResolution) { setShowResolution(true); return; }
            handleResolve('resolved');
          }}>
            <CheckCircle className="w-4 h-4" />
            Resolve with Instructions
          </Button>
          <Button size="sm" variant="outline" disabled={isResolving}>
            Take Over
          </Button>
          <Button size="sm" variant="ghost" className="text-neutral-500" disabled={isResolving} onClick={() => {
            handleResolve('dismissed');
          }}>
            <XCircle className="w-4 h-4" />
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}

interface EscalationsViewProps {
  escalations: Escalation[];
  employees: Employee[];
}

export function EscalationsView({ escalations: initialEscalations, employees }: EscalationsViewProps) {
  const [escalations, setEscalations] = useState(initialEscalations);

  const open = escalations
    .filter((e) => e.status === 'open')
    .sort((a, b) => {
      const urgencyOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4);
    });

  async function handleResolve(id: string, action: string, resolution?: string) {
    try {
      const res = await fetch(`/api/escalations/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, resolution }),
      });

      if (res.ok) {
        setEscalations((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      setEscalations((prev) => prev.filter((e) => e.id !== id));
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Escalation Center</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {open.length} open escalation{open.length !== 1 ? 's' : ''} requiring attention
        </p>
      </div>

      {open.length > 0 ? (
        <div className="space-y-4">
          {open.map((escalation) => (
            <EscalationCard
              key={escalation.id}
              escalation={escalation}
              onResolve={handleResolve}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-1">No Open Escalations</h3>
          <p className="text-neutral-500">Everything is running smoothly.</p>
        </div>
      )}
    </div>
  );
}
