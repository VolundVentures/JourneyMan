'use client';

import { useState } from 'react';
import {
  Check,
  X,
  Edit3,
  ChevronDown,
  ChevronUp,
  PartyPopper,
  Mail,
  Calendar,
  FileText,
  Database,
  MessageSquare,
} from 'lucide-react';
import { cn, formatRelativeTime, employeeEmojis } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Approval, Employee } from '@journeyman/shared';

const actionIcons: Record<string, React.ElementType> = {
  send_email: Mail,
  calendar_reschedule: Calendar,
  vendor_contract: FileText,
  crm_update: Database,
  client_communication: MessageSquare,
};

function ApprovalCard({
  approval,
  employees,
  onResolve,
}: {
  approval: Approval;
  employees: Employee[];
  onResolve: (id: string, action: string, feedback?: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const employee = employees.find((e) => e.id === approval.employeeId);
  const ActionIcon = actionIcons[approval.actionType] || FileText;
  const emoji = employeeEmojis[approval.employeeId];

  async function handleResolve(action: string) {
    setIsResolving(true);
    try {
      await onResolve(approval.id, action, feedbackText || undefined);
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden transition-colors hover:border-neutral-300">
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Avatar
            name={approval.employeeName || 'AI'}
            emoji={emoji}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-neutral-800">
                {approval.employeeName}
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-sm text-neutral-500">{approval.employeeRole}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                <ActionIcon className="w-3 h-3 mr-1" />
                {approval.actionType.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs text-neutral-500 font-mono">
                {formatRelativeTime(approval.createdAt)}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-neutral-500 mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <Progress
                value={approval.confidenceScore * 100}
                className="w-20"
                indicatorClassName={cn(
                  approval.confidenceScore >= 0.85 ? 'bg-emerald-500' :
                  approval.confidenceScore >= 0.60 ? 'bg-amber-500' : 'bg-red-500'
                )}
              />
              <span className={cn(
                'font-mono text-sm font-semibold',
                approval.confidenceScore >= 0.85 ? 'text-emerald-600' :
                approval.confidenceScore >= 0.60 ? 'text-amber-600' : 'text-red-600'
              )}>
                {Math.round(approval.confidenceScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">What</p>
            <p className="text-sm text-neutral-700 mt-0.5">
              {typeof approval.proposedAction === 'object' && 'summary' in approval.proposedAction
                ? (approval.proposedAction.summary as string)
                : typeof approval.proposedAction === 'object' && 'type' in approval.proposedAction
                ? (approval.proposedAction.type as string).replace(/_/g, ' ')
                : JSON.stringify(approval.proposedAction)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">Why</p>
            <p className="text-sm text-neutral-600 mt-0.5 leading-relaxed">{approval.reasoning}</p>
          </div>
        </div>

        {approval.context && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-600 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Hide' : 'Show'} context
          </button>
        )}

        {expanded && approval.context && (
          <div className="rounded-lg bg-white border border-neutral-200 p-3 text-xs font-mono text-neutral-500 animate-fade-in">
            <pre className="whitespace-pre-wrap">{JSON.stringify(approval.context, null, 2)}</pre>
          </div>
        )}

        {/* Feedback input */}
        {showFeedback && (
          <div className="animate-fade-in">
            <textarea
              placeholder="Add feedback for the AI employee (optional)..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 resize-none"
              rows={2}
            />
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
          <Button size="sm" disabled={isResolving} onClick={() => {
            if (!showFeedback) { setShowFeedback(true); return; }
            handleResolve('approved');
          }}>
            <Check className="w-4 h-4" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" disabled={isResolving} onClick={() => {
            if (!showFeedback) { setShowFeedback(true); return; }
            handleResolve('rejected');
          }}>
            <X className="w-4 h-4" />
            Reject
          </Button>
          <Button size="sm" variant="outline" disabled={isResolving} onClick={() => {
            if (!showFeedback) { setShowFeedback(true); return; }
            handleResolve('modified');
          }}>
            <Edit3 className="w-4 h-4" />
            Modify
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ApprovalsViewProps {
  approvals: Approval[];
  employees: Employee[];
}

export function ApprovalsView({ approvals: initialApprovals, employees }: ApprovalsViewProps) {
  const [approvals, setApprovals] = useState(initialApprovals);
  const pending = approvals.filter((a) => a.status === 'pending');

  async function handleResolve(id: string, action: string, feedback?: string) {
    try {
      const res = await fetch(`/api/approvals/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback }),
      });

      if (res.ok) {
        // Remove the resolved approval from the list
        setApprovals((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // Fallback: just remove from UI
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Approval Queue</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {pending.length} action{pending.length !== 1 ? 's' : ''} awaiting your review
          </p>
        </div>
        {pending.length > 2 && (
          <Button variant="outline" size="sm">
            Approve All High-Confidence
          </Button>
        )}
      </div>

      {pending.length > 0 ? (
        <div className="space-y-4">
          {pending.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              employees={employees}
              onResolve={handleResolve}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <PartyPopper className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-1">All caught up!</h3>
          <p className="text-neutral-500">No pending approvals. Your AI employees are running smoothly.</p>
        </div>
      )}
    </div>
  );
}
