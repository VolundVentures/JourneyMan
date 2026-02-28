'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, LayoutDashboard, Users, UserPlus, CheckCircle, AlertTriangle,
  BookOpen, Settings, Plug, ArrowRight, Clock, Zap, Radio, GitBranch,
  Shield, BarChart3, Inbox, Phone, FileText, Calendar, Hash, Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  category: 'navigation' | 'quick_actions' | 'recent';
  keywords?: string[];
}

const navigationItems: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview & metrics', icon: LayoutDashboard, href: '/dashboard', category: 'navigation', keywords: ['home', 'overview'] },
  { id: 'mission-control', label: 'Mission Control', description: 'Live workforce monitoring', icon: Radio, href: '/dashboard/mission-control', category: 'navigation', keywords: ['live', 'monitor', 'real-time'] },
  { id: 'timeline', label: 'Timeline', description: 'Task timeline & scheduling', icon: Calendar, href: '/dashboard/timeline', category: 'navigation', keywords: ['gantt', 'schedule'] },
  { id: 'employees', label: 'Employees', description: 'Manage AI workforce', icon: Users, href: '/dashboard/employees', category: 'navigation', keywords: ['team', 'workforce', 'ai'] },
  { id: 'hire', label: 'Hire New Employee', description: 'Create a new AI employee', icon: UserPlus, href: '/dashboard/hire', category: 'navigation', keywords: ['create', 'new', 'onboard'] },
  { id: 'org-chart', label: 'Org Chart', description: 'Organization structure', icon: GitBranch, href: '/dashboard/org-chart', category: 'navigation', keywords: ['structure', 'hierarchy'] },
  { id: 'reviews', label: 'Performance Reviews', description: 'Employee review dashboard', icon: BarChart3, href: '/dashboard/reviews', category: 'navigation', keywords: ['performance', 'review'] },
  { id: 'approvals', label: 'Approvals', description: 'Pending approval queue', icon: CheckCircle, href: '/dashboard/approvals', category: 'navigation', keywords: ['approve', 'pending'] },
  { id: 'escalations', label: 'Escalations', description: 'Active escalation center', icon: AlertTriangle, href: '/dashboard/escalations', category: 'navigation', keywords: ['urgent', 'issue'] },
  { id: 'handoffs', label: 'Handoffs', description: 'Employee-to-employee handoffs', icon: ArrowRight, href: '/dashboard/handoffs', category: 'navigation', keywords: ['transfer', 'pass'] },
  { id: 'incidents', label: 'Incidents', description: 'Incident management', icon: Shield, href: '/dashboard/incidents', category: 'navigation', keywords: ['issue', 'problem', 'outage'] },
  { id: 'inbox', label: 'Inbox', description: 'Unified communications', icon: Inbox, href: '/dashboard/inbox', category: 'navigation', keywords: ['messages', 'email', 'chat'] },
  { id: 'contacts', label: 'Contacts', description: 'Contact & relationship management', icon: Users, href: '/dashboard/contacts', category: 'navigation', keywords: ['crm', 'people', 'clients'] },
  { id: 'templates', label: 'Message Templates', description: 'Communication templates', icon: FileText, href: '/dashboard/templates', category: 'navigation', keywords: ['email', 'template'] },
  { id: 'phone', label: 'Phone', description: 'Voice & phone management', icon: Phone, href: '/dashboard/phone', category: 'navigation', keywords: ['call', 'voice'] },
  { id: 'analytics', label: 'Analytics', description: 'Organization-wide intelligence', icon: BarChart3, href: '/dashboard/analytics', category: 'navigation', keywords: ['data', 'metrics', 'reports'] },
  { id: 'reports', label: 'Reports', description: 'Custom report builder', icon: FileText, href: '/dashboard/reports', category: 'navigation', keywords: ['report', 'export'] },
  { id: 'knowledge', label: 'Knowledge Base', description: 'Documents & learning', icon: BookOpen, href: '/dashboard/knowledge', category: 'navigation', keywords: ['docs', 'documents', 'wiki'] },
  { id: 'sops', label: 'SOPs', description: 'Standard operating procedures', icon: FileText, href: '/dashboard/sops', category: 'navigation', keywords: ['procedure', 'process', 'sop'] },
  { id: 'integrations', label: 'Integrations', description: 'Connected services & apps', icon: Plug, href: '/dashboard/integrations', category: 'navigation', keywords: ['connect', 'api', 'apps'] },
  { id: 'schedules', label: 'Schedules', description: 'Recurring responsibilities', icon: Calendar, href: '/dashboard/schedules', category: 'navigation', keywords: ['recurring', 'cron', 'schedule'] },
  { id: 'automations', label: 'Automations', description: 'Standing instructions & triggers', icon: Zap, href: '/dashboard/automations', category: 'navigation', keywords: ['trigger', 'rule', 'when'] },
  { id: 'audit-log', label: 'Audit Log', description: 'Activity audit trail', icon: Clock, href: '/dashboard/audit-log', category: 'navigation', keywords: ['log', 'history', 'trail'] },
  { id: 'settings', label: 'Settings', description: 'System configuration', icon: Settings, href: '/dashboard/settings', category: 'navigation', keywords: ['config', 'preferences'] },
  { id: 'api-keys', label: 'API Keys', description: 'Developer API management', icon: Hash, href: '/dashboard/settings/api-keys', category: 'navigation', keywords: ['api', 'key', 'developer'] },
];

const quickActions: CommandItem[] = [
  { id: 'hire-employee', label: 'Hire a new AI employee', icon: UserPlus, href: '/dashboard/hire', category: 'quick_actions' },
  { id: 'go-approvals', label: 'Review pending approvals', icon: CheckCircle, href: '/dashboard/approvals', category: 'quick_actions' },
  { id: 'go-escalations', label: 'Check escalations', icon: AlertTriangle, href: '/dashboard/escalations', category: 'quick_actions' },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setQuery('');
        setSelectedIndex(0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems = [...quickActions, ...navigationItems];

  const filtered = query.trim()
    ? allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.includes(q))
        );
      })
    : allItems;

  const groups = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    });
    return map;
  }, [filtered]);

  const flatItems = filtered;

  const handleSelect = (item: CommandItem) => {
    setOpen(false);
    if (item.href) router.push(item.href);
    if (item.action) item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
      handleSelect(flatItems[selectedIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  if (!open) return null;

  const categoryLabels: Record<string, string> = {
    quick_actions: 'Quick Actions',
    navigation: 'Navigation',
    recent: 'Recent',
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-neutral-800">
          <Search className="w-5 h-5 text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, pages, or ask a question..."
            className="flex-1 h-12 bg-transparent text-neutral-50 placeholder:text-neutral-600 text-sm focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin py-2">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Array.from(groups.entries()).map(([category, items]) => (
              <div key={category}>
                <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
                  {categoryLabels[category] || category}
                </p>
                {items.map((item) => {
                  const globalIndex = flatItems.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        'flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm transition-colors',
                        globalIndex === selectedIndex
                          ? 'bg-neutral-800 text-neutral-50'
                          : 'text-neutral-400 hover:text-neutral-200'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0 text-neutral-500" />
                      <div className="flex-1 min-w-0">
                        <span className="text-neutral-200">{item.label}</span>
                        {item.description && (
                          <span className="ml-2 text-xs text-neutral-600">{item.description}</span>
                        )}
                      </div>
                      {globalIndex === selectedIndex && (
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-neutral-800 text-[10px] text-neutral-600">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />K to open
          </span>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>ESC close</span>
        </div>
      </div>
    </div>
  );
}
