'use client';

import { Menu, Search, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { NotificationCenter } from '@/components/dashboard/notification-center';

interface TopbarProps {
  onMenuClick: () => void;
  onCommandBarOpen?: () => void;
}

const routeLabels: Record<string, string> = {
  employees: 'Employees',
  hire: 'Hire New Employee',
  approvals: 'Approvals',
  escalations: 'Escalations',
  knowledge: 'Knowledge Base',
  settings: 'Settings',
  'mission-control': 'Mission Control',
  timeline: 'Timeline',
  'org-chart': 'Org Chart',
  reviews: 'Reviews',
  handoffs: 'Handoffs',
  incidents: 'Incidents',
  inbox: 'Inbox',
  contacts: 'Contacts',
  templates: 'Templates',
  phone: 'Phone',
  analytics: 'Analytics',
  reports: 'Reports',
  sops: 'SOPs',
  integrations: 'Integrations',
  schedules: 'Schedules',
  automations: 'Automations',
  'audit-log': 'Audit Log',
  notifications: 'Notifications',
};

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [];

  if (segments[0] === 'dashboard') {
    crumbs.push({ label: 'Dashboard', href: '/dashboard' });

    if (segments[1]) {
      crumbs.push({ label: routeLabels[segments[1]] || segments[1] });

      if (segments[1] === 'settings' && segments[2]) {
        crumbs[crumbs.length - 1].href = '/dashboard/settings';
        const settingsLabels: Record<string, string> = {
          integrations: 'Integrations',
          'api-keys': 'API Keys',
          roles: 'Roles',
          policies: 'Policies',
          compliance: 'Compliance',
          sso: 'SSO',
          branding: 'Branding',
          billing: 'Billing',
        };
        crumbs.push({ label: settingsLabels[segments[2]] || segments[2] });
      }

      if (segments[1] === 'employees' && segments[2]) {
        crumbs[crumbs.length - 1].href = '/dashboard/employees';
        crumbs.push({ label: 'Employee Profile' });
        if (segments[3]) {
          const subLabels: Record<string, string> = {
            onboarding: 'Onboarding',
            live: 'Live View',
            reviews: 'Reviews',
            phone: 'Phone',
          };
          crumbs.push({ label: subLabels[segments[3]] || segments[3] });
        }
      }

      if (segments[1] === 'analytics' && segments[2]) {
        crumbs[crumbs.length - 1].href = '/dashboard/analytics';
        const analyticsLabels: Record<string, string> = {
          costs: 'Cost Analysis',
          communications: 'Communications',
        };
        crumbs.push({ label: analyticsLabels[segments[2]] || segments[2] });
      }

      if (segments[1] === 'knowledge' && segments[2]) {
        crumbs[crumbs.length - 1].href = '/dashboard/knowledge';
        const knowledgeLabels: Record<string, string> = {
          graph: 'Knowledge Graph',
          extracted: 'Extracted Knowledge',
        };
        crumbs.push({ label: knowledgeLabels[segments[2]] || 'Document' });
      }

      if (segments[1] === 'contacts' && segments[2]) {
        crumbs[crumbs.length - 1].href = '/dashboard/contacts';
        crumbs.push({ label: 'Contact Profile' });
      }
    }
  }

  return crumbs;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  const openCommandBar = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <header className="sticky top-0 z-30 h-14 shrink-0 flex items-center border-b border-neutral-200 bg-white/90 backdrop-blur-sm px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
      >
        <Menu className="w-5 h-5" />
      </button>

      <nav className="hidden sm:flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <a
                href={crumb.href}
                className="text-neutral-500 hover:text-neutral-600 transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className={cn(i === crumbs.length - 1 ? 'text-neutral-700 font-medium' : 'text-neutral-500')}>
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="flex-1 flex justify-center px-4">
        <button
          onClick={openCommandBar}
          className="flex items-center gap-2.5 w-full max-w-md px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-500 hover:border-neutral-300 transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search or jump to...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />
        <div className="hidden sm:block">
          <Avatar name="Zakaria Sabti" size="sm" />
        </div>
      </div>
    </header>
  );
}
