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
import { cn, formatRelativeTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockApprovals, mockEmployees } from '@/lib/mock-data';
import type { Approval } from '@journeyman/shared';

const actionIcons: Record<string, React.ElementType> = {
  send_email: Mail,
  calendar_reschedule: Calendar,
  vendor_contract: FileText,
  crm_update: Database,
  client_communication: MessageSquare,
};

function ApprovalCard({ approval }: { approval: Approval }) {
  const [expanded, setExpanded] = useState(false);
  const [resolved, setResolved] = useState(false);
  const employee = mockEmployees.find((e) => e.id === approval.employeeId);
  const ActionIcon = actionIcons[approval.actionType] || FileText;

  if (resolved) return null;

  return (
    <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-surface-700/50">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar
            name={approval.employeeName || 'AI'}
            department={employee?.department}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-semibold text-surface-100">
                {approval.employeeName}
              </span>
              <span className="text-surface-500">·</span>
              <span className="text-sm text-surface-400">{approval.employeeRole}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                <ActionIcon className="w-3 h-3 mr-1" />
                {approval.actionType.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs text-surface-500 font-mono">
                {formatRelativeTime(approval.createdAt)}
              </span>
            </div>
          </div>

          {/* Confidence meter */}
          <div className="text-right shrink-0">
            <p className="text-xs text-surface-500 mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <Progress
                value={approval.confidenceScore * 100}
                className="w-20"
                indicatorClassName={cn(
                  approval.confidenceScore >= 0.85 ? 'from-success-500 to-success-400' :
                  approval.confidenceScore >= 0.60 ? 'from-warning-500 to-warning-400' : 'from-destructive-500 to-destructive-400'
                )}
              />
              <span className={cn(
                'font-mono text-sm font-semibold',
                approval.confidenceScore >= 0.85 ? 'text-success-400' :
                approval.confidenceScore >= 0.60 ? 'text-warning-400' : 'text-destructive-400'
              )}>
                {Math.round(approval.confidenceScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Proposed action */}
        <div className="space-y-2">
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">What</p>
            <p className="text-sm text-surface-200 mt-0.5">
              {typeof approval.proposedAction === 'object' && 'summary' in approval.proposedAction
                ? (approval.proposedAction.summary as string)
                : typeof approval.proposedAction === 'object' && 'type' in approval.proposedAction
                ? (approval.proposedAction.type as string).replace(/_/g, ' ')
                : JSON.stringify(approval.proposedAction)}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Why</p>
            <p className="text-sm text-surface-300 mt-0.5 leading-relaxed">{approval.reasoning}</p>
          </div>
        </div>

        {/* Expandable context */}
        {approval.context && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Hide' : 'Show'} context
          </button>
        )}

        {expanded && approval.context && (
          <div className="rounded-lg bg-surface-900/50 border border-surface-800 p-3 text-xs font-mono text-surface-400 animate-fade-in">
            <pre className="whitespace-pre-wrap">{JSON.stringify(approval.context, null, 2)}</pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-surface-800/50">
          <Button size="sm" onClick={() => setResolved(true)} className="from-success-600 to-success-500 shadow-success-500/20">
            <Check className="w-4 h-4" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setResolved(true)}>
            <X className="w-4 h-4" />
            Reject
          </Button>
          <Button size="sm" variant="outline">
            <Edit3 className="w-4 h-4" />
            Modify
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const pending = mockApprovals.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-50">Approval Queue</h1>
          <p className="mt-1 text-sm text-surface-400">
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
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-success-500/10 flex items-center justify-center mb-4">
            <PartyPopper className="w-8 h-8 text-success-400" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-surface-200 mb-1">All caught up!</h3>
          <p className="text-surface-500">No pending approvals. Your AI employees are running smoothly.</p>
        </div>
      )}
    </div>
  );
}
