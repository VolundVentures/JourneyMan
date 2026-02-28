'use client';

import { GitBranch, Users, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';
import { mockEmployees, mockUsers } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  type: 'human' | 'ai';
  emoji?: string;
  status?: string;
  department?: string;
  children: OrgNode[];
}

const orgTree: OrgNode = {
  id: 'user-001',
  name: 'Zakaria Sabti',
  role: 'CEO & Admin',
  type: 'human',
  children: [
    {
      id: 'user-002',
      name: 'Sara Lindström',
      role: 'Operations Manager',
      type: 'human',
      children: [
        { id: 'emp-001', name: 'Atlas', role: 'Operations Coordinator', type: 'ai', emoji: '🗺️', status: 'active', department: 'Operations', children: [] },
        { id: 'emp-005', name: 'Ember', role: 'Customer Success Agent', type: 'ai', emoji: '🔥', status: 'active', department: 'Customer Success', children: [] },
      ],
    },
    {
      id: 'emp-002',
      name: 'Nova',
      role: 'Executive Assistant',
      type: 'ai',
      emoji: '✨',
      status: 'active',
      department: 'Executive',
      children: [],
    },
    {
      id: 'user-003',
      name: 'James Chen',
      role: 'Sales Lead',
      type: 'human',
      children: [
        { id: 'emp-003', name: 'Apex', role: 'Sales Development Rep', type: 'ai', emoji: '🎯', status: 'active', department: 'Sales', children: [] },
      ],
    },
    {
      id: 'emp-004',
      name: 'Sage',
      role: 'Research Analyst',
      type: 'ai',
      emoji: '🔮',
      status: 'active',
      department: 'Research',
      children: [
        { id: 'emp-006', name: 'Flux', role: 'Content Strategist', type: 'ai', emoji: '⚡', status: 'active', department: 'Content', children: [] },
      ],
    },
  ],
};

function OrgNodeCard({ node, level = 0 }: { node: OrgNode; level?: number }) {
  return (
    <div className="flex flex-col items-center">
      <Card className={cn(
        'w-48 transition-all hover:border-neutral-600',
        node.type === 'human' ? 'border-blue-900/50' : 'border-neutral-800'
      )}>
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">
            {node.type === 'ai' ? node.emoji : '👤'}
          </div>
          <p className="text-sm font-semibold text-neutral-100">{node.name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{node.role}</p>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <Badge variant={node.type === 'human' ? 'outline' : 'secondary'} className="text-[10px]">
              {node.type === 'human' ? 'Human' : 'AI'}
            </Badge>
            {node.department && (
              <Badge variant="secondary" className="text-[10px]">{node.department}</Badge>
            )}
          </div>
          {node.status && (
            <div className="mt-2">
              <StatusBadge status={node.status as 'active'} />
            </div>
          )}
        </CardContent>
      </Card>

      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-neutral-800" />
          <div className="flex items-start gap-8">
            {node.children.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-neutral-800" />
                <OrgNodeCard node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const humanCount = 3;
  const aiCount = mockEmployees.filter((e) => e.status !== 'terminated').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <GitBranch className="w-6 h-6" />
            Organization Chart
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Visual hierarchy of your human and AI workforce
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-neutral-400">{humanCount} Humans</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-400">{aiCount} AI Employees</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px] flex justify-center py-8">
          <OrgNodeCard node={orgTree} />
        </div>
      </div>
    </div>
  );
}
