'use client';

import { useState } from 'react';
import { FileText, Plus, Search, Users, CheckCircle, Clock, AlertTriangle, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { employeeEmojis } from '@/lib/utils';

interface SOP {
  id: string;
  title: string;
  description: string;
  category: string;
  version: string;
  lastUpdated: string;
  assignedEmployees: { id: string; name: string }[];
  steps: number;
  complianceRate: number;
  executionCount: number;
  status: 'active' | 'draft' | 'archived';
}

const mockSOPs: SOP[] = [
  {
    id: 'sop-1',
    title: 'Inbound Lead Qualification',
    description: 'When a new lead fills out the demo form, research the company, score the lead based on ICP fit, and send personalized outreach within 30 minutes.',
    category: 'Sales',
    version: '2.3',
    lastUpdated: '2026-02-25T00:00:00Z',
    assignedEmployees: [{ id: 'emp-003', name: 'Apex' }],
    steps: 7,
    complianceRate: 92,
    executionCount: 234,
    status: 'active',
  },
  {
    id: 'sop-2',
    title: 'Daily Operations Report',
    description: 'Compile data from all active systems, generate KPI summary, identify anomalies, and distribute to stakeholders by 9 AM.',
    category: 'Operations',
    version: '1.8',
    lastUpdated: '2026-02-20T00:00:00Z',
    assignedEmployees: [{ id: 'emp-001', name: 'Atlas' }],
    steps: 5,
    complianceRate: 98,
    executionCount: 45,
    status: 'active',
  },
  {
    id: 'sop-3',
    title: 'Customer Support Escalation',
    description: 'When a ticket involves data discrepancies, legal questions, or customer threats, follow the escalation decision tree. Always confirm before external communication.',
    category: 'Customer Success',
    version: '3.1',
    lastUpdated: '2026-02-27T00:00:00Z',
    assignedEmployees: [{ id: 'emp-005', name: 'Ember' }],
    steps: 9,
    complianceRate: 85,
    executionCount: 89,
    status: 'active',
  },
  {
    id: 'sop-4',
    title: 'Executive Briefing Preparation',
    description: 'Before any board or executive meeting, compile agenda, prior meeting notes, action items, and prepare a 1-page brief. Share 24 hours before the meeting.',
    category: 'Executive',
    version: '1.5',
    lastUpdated: '2026-02-18T00:00:00Z',
    assignedEmployees: [{ id: 'emp-002', name: 'Nova' }],
    steps: 6,
    complianceRate: 100,
    executionCount: 12,
    status: 'active',
  },
  {
    id: 'sop-5',
    title: 'Content Publication Workflow',
    description: 'Draft content, run quality checks, get manager approval for tone/accuracy, optimize for SEO, and publish across appropriate channels.',
    category: 'Content',
    version: '1.2',
    lastUpdated: '2026-02-15T00:00:00Z',
    assignedEmployees: [{ id: 'emp-006', name: 'Flux' }],
    steps: 8,
    complianceRate: 88,
    executionCount: 34,
    status: 'active',
  },
  {
    id: 'sop-6',
    title: 'Competitive Intelligence Gathering',
    description: 'Monitor competitor announcements, pricing changes, and product launches. Compile weekly summary with strategic implications.',
    category: 'Research',
    version: '0.9',
    lastUpdated: '2026-02-10T00:00:00Z',
    assignedEmployees: [{ id: 'emp-004', name: 'Sage' }],
    steps: 4,
    complianceRate: 0,
    executionCount: 0,
    status: 'draft',
  },
];

export default function SOPsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockSOPs.filter((sop) =>
    searchQuery === '' ||
    sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sop.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Standard Operating Procedures
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Guidelines your AI employees follow with judgment — not rigid flowcharts
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          New SOP
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SOPs..."
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((sop) => (
          <Card key={sop.id} className={cn(
            'hover:border-neutral-300 transition-all cursor-pointer',
            sop.status === 'draft' && 'border-dashed'
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">{sop.category}</Badge>
                <Badge variant={sop.status === 'active' ? 'default' : 'outline'} className="text-[10px]">
                  {sop.status}
                </Badge>
              </div>
              <CardTitle className="text-sm mt-2">{sop.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-neutral-500 mb-4 line-clamp-2">{sop.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-neutral-600" />
                  <div className="flex items-center gap-1">
                    {sop.assignedEmployees.map((emp) => (
                      <span key={emp.id} className="text-sm" title={emp.name}>{employeeEmojis[emp.id]}</span>
                    ))}
                  </div>
                </div>

                {sop.status === 'active' && (
                  <>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-500">Compliance</span>
                        <span className="text-neutral-600">{sop.complianceRate}%</span>
                      </div>
                      <Progress
                        value={sop.complianceRate}
                        indicatorClassName={sop.complianceRate >= 90 ? 'bg-emerald-400' : sop.complianceRate >= 70 ? 'bg-amber-400' : 'bg-red-400'}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{sop.steps} steps</span>
                      <span>{sop.executionCount} executions</span>
                      <span>v{sop.version}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
