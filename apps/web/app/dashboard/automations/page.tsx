'use client';

import { useState } from 'react';
import { Zap, Plus, Search, ArrowRight, ToggleLeft, ToggleRight, Clock, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { employeeEmojis } from '@/lib/utils';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  employeeId: string;
  employeeName: string;
  instruction: string;
  enabled: boolean;
  executionCount: number;
  lastExecuted: string | null;
  category: string;
}

const mockRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'New Lead Auto-Research',
    trigger: 'When a new lead fills out the demo request form',
    employeeId: 'emp-003',
    employeeName: 'Apex',
    instruction: 'Research the lead\'s company, identify decision-makers, score ICP fit, and send personalized outreach within 30 minutes',
    enabled: true,
    executionCount: 156,
    lastExecuted: '2026-02-28T09:30:00Z',
    category: 'Sales',
  },
  {
    id: 'rule-2',
    name: 'Client Email Auto-Draft',
    trigger: 'When a new email arrives from a known client',
    employeeId: 'emp-002',
    employeeName: 'Nova',
    instruction: 'Draft a response using the client\'s communication history and any open action items. Flag for review before sending.',
    enabled: true,
    executionCount: 89,
    lastExecuted: '2026-02-28T10:15:00Z',
    category: 'Communication',
  },
  {
    id: 'rule-3',
    name: 'Support Ticket Auto-Triage',
    trigger: 'When a new support ticket is created',
    employeeId: 'emp-005',
    employeeName: 'Ember',
    instruction: 'Classify the ticket by severity and category, check knowledge base for known solutions, and either resolve immediately or route to the right team member',
    enabled: true,
    executionCount: 312,
    lastExecuted: '2026-02-28T10:42:00Z',
    category: 'Support',
  },
  {
    id: 'rule-4',
    name: 'Competitor Alert Monitor',
    trigger: 'When a competitor makes a public announcement or pricing change',
    employeeId: 'emp-004',
    employeeName: 'Sage',
    instruction: 'Analyze the announcement, assess strategic impact, and generate a brief for the leadership team within 2 hours',
    enabled: true,
    executionCount: 12,
    lastExecuted: '2026-02-25T14:00:00Z',
    category: 'Intelligence',
  },
  {
    id: 'rule-5',
    name: 'Weekly Blog Scheduler',
    trigger: 'Every Monday at 9 AM',
    employeeId: 'emp-006',
    employeeName: 'Flux',
    instruction: 'Review the content calendar, select the next topic, research trending keywords, and draft an 800-word blog outline',
    enabled: false,
    executionCount: 8,
    lastExecuted: '2026-02-24T09:00:00Z',
    category: 'Content',
  },
  {
    id: 'rule-6',
    name: 'End-of-Day Report',
    trigger: 'Every weekday at 5 PM',
    employeeId: 'emp-001',
    employeeName: 'Atlas',
    instruction: 'Compile all task completions, pending items, and anomalies from the day. Generate summary and distribute to managers',
    enabled: true,
    executionCount: 42,
    lastExecuted: '2026-02-27T17:00:00Z',
    category: 'Operations',
  },
];

export default function AutomationsPage() {
  const [rules, setRules] = useState(mockRules);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const filtered = rules.filter((rule) =>
    searchQuery === '' ||
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.trigger.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <Zap className="w-6 h-6" />
            Standing Instructions
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Trigger-based instructions for your AI employees — they use judgment in execution
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rules..."
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((rule) => (
          <Card key={rule.id} className={cn(!rule.enabled && 'opacity-60')}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-neutral-800">{rule.name}</h3>
                    <Badge variant="secondary" className="text-[10px]">{rule.category}</Badge>
                  </div>

                  <div className="bg-neutral-100 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-500 font-semibold uppercase">WHEN</span>
                      <span className="text-amber-600">{rule.trigger}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <ArrowRight className="w-3 h-3 text-neutral-500" />
                      <span className="text-lg">{employeeEmojis[rule.employeeId]}</span>
                      <span className="text-neutral-500 font-medium">{rule.employeeName}</span>
                      <span className="text-neutral-500">should</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 ml-5">{rule.instruction}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {rule.executionCount} executions
                    </span>
                    {rule.lastExecuted && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last: {new Date(rule.lastExecuted).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
