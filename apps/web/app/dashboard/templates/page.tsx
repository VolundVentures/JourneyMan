'use client';

import { useState } from 'react';
import { FileText, Plus, Search, Mail, MessageSquare, Phone, Hash, Copy, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MessageTemplate {
  id: string;
  name: string;
  category: 'outreach' | 'follow_up' | 'response' | 'escalation' | 'internal';
  channels: ('email' | 'slack' | 'phone')[];
  preview: string;
  variables: string[];
  usageCount: number;
  successRate: number;
  lastUsed: string;
}

const mockTemplates: MessageTemplate[] = [
  { id: 'tpl-1', name: 'Initial Outreach — Enterprise', category: 'outreach', channels: ['email'], preview: 'Hi {{firstName}}, I noticed {{companyName}} has been growing rapidly in the {{industry}} space...', variables: ['firstName', 'companyName', 'industry'], usageCount: 89, successRate: 34, lastUsed: '2026-02-28' },
  { id: 'tpl-2', name: 'Demo Follow-Up', category: 'follow_up', channels: ['email'], preview: 'Hi {{firstName}}, great meeting yesterday! As discussed, here are the key points we covered...', variables: ['firstName', 'meetingDate'], usageCount: 56, successRate: 62, lastUsed: '2026-02-27' },
  { id: 'tpl-3', name: 'Support Acknowledgment', category: 'response', channels: ['email', 'slack'], preview: 'Thank you for reaching out, {{firstName}}. I understand the issue with {{issueType}} and I\'m looking into it...', variables: ['firstName', 'issueType', 'ticketId'], usageCount: 234, successRate: 88, lastUsed: '2026-02-28' },
  { id: 'tpl-4', name: 'Escalation Notification', category: 'escalation', channels: ['slack'], preview: '🚨 Escalation from {{employeeName}}: {{summary}}. Required action: {{actionNeeded}}', variables: ['employeeName', 'summary', 'actionNeeded'], usageCount: 45, successRate: 95, lastUsed: '2026-02-28' },
  { id: 'tpl-5', name: 'Handoff Context Brief', category: 'internal', channels: ['slack'], preview: '📋 Handoff from {{fromEmployee}} → {{toEmployee}}: {{taskTitle}}. Key context: {{context}}', variables: ['fromEmployee', 'toEmployee', 'taskTitle', 'context'], usageCount: 23, successRate: 100, lastUsed: '2026-02-26' },
  { id: 'tpl-6', name: 'Cold Outreach — SMB', category: 'outreach', channels: ['email'], preview: 'Hi {{firstName}}, I help companies like {{companyName}} save 20+ hours per week with AI employees...', variables: ['firstName', 'companyName'], usageCount: 156, successRate: 28, lastUsed: '2026-02-28' },
];

const categoryColors: Record<string, string> = {
  outreach: 'bg-blue-50 text-blue-600',
  follow_up: 'bg-purple-50 text-purple-600',
  response: 'bg-emerald-50 text-emerald-600',
  escalation: 'bg-red-50 text-red-600',
  internal: 'bg-neutral-100 text-neutral-500',
};

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  slack: MessageSquare,
  phone: Phone,
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = mockTemplates.filter((t) => {
    const matchesSearch = searchQuery === '' || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Message Templates
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Reusable communication templates with variable insertion
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search templates..." className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'outreach', 'follow_up', 'response', 'escalation', 'internal'].map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              categoryFilter === cat ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:text-neutral-600'
            )}>
              {cat === 'all' ? 'All' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <Card key={template.id} className="hover:border-neutral-300 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={categoryColors[template.category]}>{template.category.replace('_', ' ')}</Badge>
                <div className="flex items-center gap-1">
                  {template.channels.map((ch) => {
                    const Icon = channelIcons[ch];
                    return <Icon key={ch} className="w-3.5 h-3.5 text-neutral-500" />;
                  })}
                </div>
              </div>
              <CardTitle className="text-sm mt-2">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-100 rounded-lg p-3 mb-3 font-mono text-xs text-neutral-500 line-clamp-3">
                {template.preview}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.variables.map((v) => (
                  <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{template.usageCount} uses</span>
                <span>{template.successRate}% success</span>
              </div>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Copy className="w-3 h-3" /> Duplicate
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs">
                  <Edit className="w-3 h-3" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
