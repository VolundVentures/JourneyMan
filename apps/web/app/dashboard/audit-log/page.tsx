'use client';

import { useState } from 'react';
import { Clock, Shield, Download, Search, Filter, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'user' | 'employee' | 'system';
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'escalate' | 'login' | 'config_change';
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  verified: boolean;
}

const mockAuditLog: AuditEntry[] = [
  { id: 'audit-001', timestamp: '2026-02-28T10:45:00Z', actor: 'Zakaria Sabti', actorType: 'user', action: 'Approved task execution', actionType: 'approve', resource: 'Approval', resourceId: 'apv-001', details: 'Approved Nova\'s proposal to CloudVault ($48,000 contract)', ipAddress: '192.168.1.100', verified: true },
  { id: 'audit-002', timestamp: '2026-02-28T10:30:00Z', actor: 'Atlas', actorType: 'employee', action: 'Completed task', actionType: 'update', resource: 'Task', resourceId: 'task-001', details: 'Completed daily operations status report', ipAddress: 'internal', verified: true },
  { id: 'audit-003', timestamp: '2026-02-28T10:15:00Z', actor: 'Nova', actorType: 'employee', action: 'Created escalation', actionType: 'escalate', resource: 'Escalation', resourceId: 'esc-003', details: 'Flagged GDPR compliance question from prospect', ipAddress: 'internal', verified: true },
  { id: 'audit-004', timestamp: '2026-02-28T09:45:00Z', actor: 'Sara Lindström', actorType: 'user', action: 'Updated employee config', actionType: 'config_change', resource: 'Employee', resourceId: 'emp-005', details: 'Changed Ember autonomy from supervised to semi-autonomous', ipAddress: '192.168.1.101', verified: true },
  { id: 'audit-005', timestamp: '2026-02-28T09:30:00Z', actor: 'System', actorType: 'system', action: 'Integration sync', actionType: 'update', resource: 'Integration', resourceId: 'int-hubspot', details: 'HubSpot sync completed: 47 contacts updated', ipAddress: 'internal', verified: true },
  { id: 'audit-006', timestamp: '2026-02-28T09:00:00Z', actor: 'Zakaria Sabti', actorType: 'user', action: 'User login', actionType: 'login', resource: 'Session', resourceId: 'sess-042', details: 'Logged in via Google OAuth', ipAddress: '192.168.1.100', verified: true },
  { id: 'audit-007', timestamp: '2026-02-27T18:00:00Z', actor: 'Apex', actorType: 'employee', action: 'Created contact', actionType: 'create', resource: 'Contact', resourceId: 'contact-089', details: 'Added new lead: Marcus Rivera, TechForward Inc', ipAddress: 'internal', verified: true },
  { id: 'audit-008', timestamp: '2026-02-27T16:30:00Z', actor: 'James Chen', actorType: 'user', action: 'Rejected approval', actionType: 'reject', resource: 'Approval', resourceId: 'apv-005', details: 'Rejected Flux\'s social media post — tone inappropriate', ipAddress: '192.168.1.102', verified: true },
  { id: 'audit-009', timestamp: '2026-02-27T14:00:00Z', actor: 'System', actorType: 'system', action: 'Scheduled task executed', actionType: 'update', resource: 'Schedule', resourceId: 'sched-001', details: 'Daily vendor follow-up ran successfully for Atlas', ipAddress: 'internal', verified: true },
  { id: 'audit-010', timestamp: '2026-02-27T11:00:00Z', actor: 'Sage', actorType: 'employee', action: 'Deleted draft', actionType: 'delete', resource: 'Draft', resourceId: 'draft-015', details: 'Deleted outdated market analysis draft', ipAddress: 'internal', verified: true },
];

const actionTypeColors: Record<string, string> = {
  create: 'bg-emerald-50 text-emerald-600',
  update: 'bg-blue-50 text-blue-600',
  delete: 'bg-red-50 text-red-600',
  approve: 'bg-emerald-50 text-emerald-600',
  reject: 'bg-red-50 text-red-600',
  escalate: 'bg-amber-50 text-amber-600',
  login: 'bg-neutral-100 text-neutral-500',
  config_change: 'bg-purple-50 text-purple-600',
};

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = mockAuditLog.filter((entry) => {
    const matchesSearch = searchQuery === '' ||
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || entry.actionType === actionFilter;
    return matchesSearch && matchesAction;
  });

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      sortable: true,
      className: 'w-40',
      render: (entry: AuditEntry) => (
        <span className="text-xs font-mono text-neutral-500">
          {new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'Actor',
      sortable: true,
      render: (entry: AuditEntry) => (
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded',
            entry.actorType === 'user' ? 'bg-blue-50 text-blue-600' :
            entry.actorType === 'employee' ? 'bg-emerald-50 text-emerald-600' :
            'bg-neutral-100 text-neutral-500'
          )}>
            {entry.actorType}
          </span>
          <span className="text-sm text-neutral-700">{entry.actor}</span>
        </div>
      ),
    },
    {
      key: 'actionType',
      header: 'Action',
      sortable: true,
      render: (entry: AuditEntry) => (
        <Badge className={actionTypeColors[entry.actionType]}>
          {entry.actionType.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (entry: AuditEntry) => (
        <span className="text-sm text-neutral-500 line-clamp-1">{entry.details}</span>
      ),
    },
    {
      key: 'verified',
      header: '',
      className: 'w-10',
      render: (entry: AuditEntry) => (
        entry.verified && (
          <Tooltip content="Cryptographically verified">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
          </Tooltip>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Clock className="w-6 h-6" />
            Audit Log
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Immutable record of all actions across your organization
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit log..."
                className="pl-9"
              />
            </div>
            <Select
              value={actionFilter}
              onChange={setActionFilter}
              options={[
                { value: 'all', label: 'All Actions' },
                { value: 'create', label: 'Create' },
                { value: 'update', label: 'Update' },
                { value: 'delete', label: 'Delete' },
                { value: 'approve', label: 'Approve' },
                { value: 'reject', label: 'Reject' },
                { value: 'escalate', label: 'Escalate' },
                { value: 'login', label: 'Login' },
                { value: 'config_change', label: 'Config Change' },
              ]}
              className="w-44"
            />
          </div>

          <DataTable
            data={filtered}
            columns={columns}
            pageSize={10}
            getRowId={(entry) => entry.id}
            emptyMessage="No audit entries match your filters"
          />
        </CardContent>
      </Card>
    </div>
  );
}
