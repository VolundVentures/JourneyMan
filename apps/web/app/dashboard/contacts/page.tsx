'use client';

import { useState } from 'react';
import { Users, Search, Plus, Building2, Mail, Phone, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  lastContact: string;
  interactionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  assignedEmployee: string;
  channel: string;
}

const mockContacts: Contact[] = [
  { id: 'c-1', name: 'Sarah Johnson', email: 'sarah@cloudvault.io', company: 'CloudVault Inc.', role: 'VP of Engineering', lastContact: '2026-02-28', interactionCount: 24, sentiment: 'positive', assignedEmployee: 'Nova', channel: 'email' },
  { id: 'c-2', name: 'Marcus Rivera', email: 'mrivera@techforward.com', company: 'TechForward Inc.', role: 'CTO', lastContact: '2026-02-27', interactionCount: 8, sentiment: 'neutral', assignedEmployee: 'Apex', channel: 'email' },
  { id: 'c-3', name: 'Lisa Park', email: 'lisa@acmecorp.com', company: 'Acme Corp', role: 'Procurement Manager', lastContact: '2026-02-28', interactionCount: 45, sentiment: 'positive', assignedEmployee: 'Atlas', channel: 'email' },
  { id: 'c-4', name: 'David Kim', email: 'dkim@innovatetech.io', company: 'InnovateTech', role: 'Head of Product', lastContact: '2026-02-26', interactionCount: 12, sentiment: 'negative', assignedEmployee: 'Apex', channel: 'email' },
  { id: 'c-5', name: 'Rachel Adams', email: 'radams@globalfin.com', company: 'GlobalFin Services', role: 'IT Director', lastContact: '2026-02-25', interactionCount: 6, sentiment: 'neutral', assignedEmployee: 'Ember', channel: 'phone' },
  { id: 'c-6', name: 'Tom Chen', email: 'tchen@startupxyz.com', company: 'StartupXYZ', role: 'CEO', lastContact: '2026-02-24', interactionCount: 3, sentiment: 'positive', assignedEmployee: 'Apex', channel: 'slack' },
  { id: 'c-7', name: 'Emily Watson', email: 'ewatson@medtech.co', company: 'MedTech Solutions', role: 'COO', lastContact: '2026-02-23', interactionCount: 18, sentiment: 'positive', assignedEmployee: 'Nova', channel: 'email' },
];

const sentimentBadge = {
  positive: 'bg-emerald-950/50 text-emerald-400',
  neutral: 'bg-neutral-800 text-neutral-400',
  negative: 'bg-red-950/50 text-red-400',
};

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockContacts.filter((c) =>
    searchQuery === '' ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Name', sortable: true, render: (c: Contact) => (
      <div>
        <p className="text-sm font-medium text-neutral-200">{c.name}</p>
        <p className="text-xs text-neutral-500">{c.email}</p>
      </div>
    )},
    { key: 'company', header: 'Company', sortable: true, render: (c: Contact) => (
      <div className="flex items-center gap-2">
        <Building2 className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-sm text-neutral-300">{c.company}</span>
      </div>
    )},
    { key: 'role', header: 'Role', render: (c: Contact) => <span className="text-sm text-neutral-400">{c.role}</span> },
    { key: 'sentiment', header: 'Sentiment', render: (c: Contact) => <Badge className={sentimentBadge[c.sentiment]}>{c.sentiment}</Badge> },
    { key: 'interactionCount', header: 'Interactions', sortable: true, render: (c: Contact) => <span className="text-sm font-mono text-neutral-300">{c.interactionCount}</span> },
    { key: 'assignedEmployee', header: 'Managed By', render: (c: Contact) => <Badge variant="secondary" className="text-[10px]">{c.assignedEmployee}</Badge> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Users className="w-6 h-6" />
            Contacts
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            All external contacts your AI employees interact with
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search contacts..." className="pl-9" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        pageSize={10}
        getRowId={(c) => c.id}
        selectable
      />
    </div>
  );
}
