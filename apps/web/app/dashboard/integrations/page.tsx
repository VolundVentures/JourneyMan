'use client';

import { useState } from 'react';
import { Plug, Search, CheckCircle, AlertTriangle, Plus, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  status: 'connected' | 'available' | 'error';
  lastSync?: string;
  dataVolume?: string;
  errorRate?: number;
  features?: string[];
}

const mockIntegrations: Integration[] = [
  { id: 'int-1', name: 'Google Workspace', category: 'Productivity', description: 'Gmail, Calendar, Drive, and Docs integration', icon: '📧', status: 'connected', lastSync: '2 min ago', dataVolume: '1,240 items', errorRate: 0 },
  { id: 'int-2', name: 'Slack', category: 'Communication', description: 'Real-time messaging and channel management', icon: '💬', status: 'connected', lastSync: 'Live', dataVolume: '890 messages/day', errorRate: 0 },
  { id: 'int-3', name: 'HubSpot', category: 'CRM', description: 'Contact management, deals, and pipeline tracking', icon: '🧲', status: 'error', lastSync: '2 hours ago', dataVolume: '5,670 contacts', errorRate: 12 },
  { id: 'int-4', name: 'Notion', category: 'Knowledge', description: 'Documentation and knowledge base sync', icon: '📝', status: 'connected', lastSync: '15 min ago', dataVolume: '340 pages', errorRate: 0 },
  { id: 'int-5', name: 'Asana', category: 'Project Management', description: 'Task tracking and project management', icon: '📋', status: 'connected', lastSync: '5 min ago', dataVolume: '120 tasks', errorRate: 0 },
  { id: 'int-6', name: 'Salesforce', category: 'CRM', description: 'Enterprise CRM integration', icon: '☁️', status: 'available', features: ['Contact sync', 'Deal tracking', 'Reporting', 'Lead scoring'] },
  { id: 'int-7', name: 'Zendesk', category: 'Support', description: 'Help desk and customer support platform', icon: '🎧', status: 'available', features: ['Ticket management', 'Auto-response', 'Knowledge base'] },
  { id: 'int-8', name: 'Intercom', category: 'Communication', description: 'Live chat and customer messaging', icon: '💭', status: 'available', features: ['Live chat', 'User data', 'Automation'] },
  { id: 'int-9', name: 'Jira', category: 'Project Management', description: 'Issue tracking and agile project management', icon: '🔵', status: 'available', features: ['Issue sync', 'Sprint tracking', 'Bug management'] },
  { id: 'int-10', name: 'Stripe', category: 'Billing', description: 'Payment processing and subscription management', icon: '💳', status: 'available', features: ['Invoice sync', 'Payment alerts', 'Revenue data'] },
  { id: 'int-11', name: 'Twilio', category: 'Voice', description: 'Voice calling and SMS capabilities', icon: '📱', status: 'connected', lastSync: 'Live', dataVolume: '45 calls/week', errorRate: 1 },
  { id: 'int-12', name: 'LinkedIn', category: 'Social', description: 'Professional networking and outreach', icon: '🔗', status: 'available', features: ['Profile enrichment', 'InMail', 'Company data'] },
];

const categories = ['All', 'Productivity', 'Communication', 'CRM', 'Project Management', 'Support', 'Knowledge', 'Voice', 'Social', 'Billing'];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [view, setView] = useState<'all' | 'connected'>('all');

  const connected = mockIntegrations.filter((i) => i.status === 'connected' || i.status === 'error');
  const available = mockIntegrations.filter((i) => i.status === 'available');

  const displayed = (view === 'connected' ? connected : mockIntegrations).filter((i) => {
    const matchesSearch = searchQuery === '' || i.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Plug className="w-6 h-6" />
            Integrations
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Connect your tools to empower your AI workforce
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('all')}>All</Button>
          <Button variant={view === 'connected' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('connected')}>Connected ({connected.length})</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search integrations..." className="pl-9" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
              categoryFilter === cat ? 'bg-neutral-800 text-neutral-50' : 'text-neutral-600 hover:text-neutral-400'
            )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayed.map((integration) => (
          <Card key={integration.id} className={cn(
            'hover:border-neutral-700 transition-all',
            integration.status === 'error' && 'border-red-900/30'
          )}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-neutral-100">{integration.name}</h3>
                    {integration.status === 'connected' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {integration.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </div>
                  <Badge variant="secondary" className="text-[10px] mb-2">{integration.category}</Badge>
                  <p className="text-xs text-neutral-500">{integration.description}</p>

                  {(integration.status === 'connected' || integration.status === 'error') && (
                    <div className="mt-3 space-y-1.5 text-xs text-neutral-500">
                      <div className="flex justify-between">
                        <span>Last sync: {integration.lastSync}</span>
                        <span>{integration.dataVolume}</span>
                      </div>
                      {integration.errorRate !== undefined && integration.errorRate > 0 && (
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{integration.errorRate}% error rate</span>
                        </div>
                      )}
                    </div>
                  )}

                  {integration.status === 'available' && integration.features && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {integration.features.map((f) => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {integration.status === 'available' ? (
                  <Button size="sm" className="w-full">
                    <Plus className="w-3 h-3" /> Connect
                  </Button>
                ) : integration.status === 'error' ? (
                  <Button variant="destructive" size="sm" className="w-full">
                    <RefreshCw className="w-3 h-3" /> Reconnect
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-3 h-3" /> Configure
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
