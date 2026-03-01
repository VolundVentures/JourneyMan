'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, UserPlus, CheckCircle, AlertTriangle,
  BookOpen, Settings, Plug, X, Radio, Calendar, GitBranch,
  BarChart3, ArrowRight, Shield, Inbox, Phone, FileText,
  Clock, Zap, Hash, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockApprovals, mockEscalations } from '@/lib/mock-data';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const pendingApprovals = mockApprovals.filter((a) => a.status === 'pending').length;
const openEscalations = mockEscalations.filter((e) => e.status === 'open').length;

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
}

const navSections: NavSection[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Mission Control', href: '/dashboard/mission-control', icon: Radio, badge: 'LIVE' },
      { label: 'Timeline', href: '/dashboard/timeline', icon: Calendar },
    ],
  },
  {
    label: 'WORKFORCE',
    items: [
      { label: 'Employees', href: '/dashboard/employees', icon: Users },
      { label: 'Hire New', href: '/dashboard/hire', icon: UserPlus },
      { label: 'Org Chart', href: '/dashboard/org-chart', icon: GitBranch },
      { label: 'Reviews', href: '/dashboard/reviews', icon: BarChart3 },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Approvals', href: '/dashboard/approvals', icon: CheckCircle, count: pendingApprovals },
      { label: 'Escalations', href: '/dashboard/escalations', icon: AlertTriangle, count: openEscalations },
      { label: 'Handoffs', href: '/dashboard/handoffs', icon: ArrowRight },
      { label: 'Incidents', href: '/dashboard/incidents', icon: Shield },
    ],
  },
  {
    label: 'COMMUNICATIONS',
    items: [
      { label: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
      { label: 'Contacts', href: '/dashboard/contacts', icon: Users },
      { label: 'Templates', href: '/dashboard/templates', icon: FileText },
      { label: 'Phone', href: '/dashboard/phone', icon: Phone },
    ],
    defaultCollapsed: true,
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Reports', href: '/dashboard/reports', icon: FileText },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
      { label: 'SOPs', href: '/dashboard/sops', icon: FileText },
      { label: 'Integrations', href: '/dashboard/integrations', icon: Plug },
      { label: 'Schedules', href: '/dashboard/schedules', icon: Calendar },
      { label: 'Automations', href: '/dashboard/automations', icon: Zap },
    ],
    defaultCollapsed: true,
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'Audit Log', href: '/dashboard/audit-log', icon: Clock },
      { label: 'API Keys', href: '/dashboard/settings/api-keys', icon: Hash },
    ],
    defaultCollapsed: true,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navSections.forEach((s) => {
      if (s.defaultCollapsed) initial[s.label] = true;
    });
    return initial;
  });

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const toggleSection = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Auto-expand section containing the active route
  React.useEffect(() => {
    navSections.forEach((section) => {
      if (section.items.some((item) => isActive(item.href))) {
        setCollapsed((prev) => ({ ...prev, [section.label]: false }));
      }
    });
  }, [pathname]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[240px] flex flex-col',
          'bg-white border-r border-neutral-200',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase">
              JourneyMan
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin">
          {navSections.map((section) => {
            const isCollapsed = collapsed[section.label];
            const hasActive = section.items.some((item) => isActive(item.href));

            return (
              <div key={section.label}>
                <button
                  onClick={() => toggleSection(section.label)}
                  className="flex items-center justify-between w-full px-3 mb-1 mt-3 first:mt-0 group"
                >
                  <p className={cn(
                    'text-[10px] font-semibold uppercase tracking-[0.15em]',
                    hasActive ? 'text-neutral-500' : 'text-neutral-400'
                  )}>
                    {section.label}
                  </p>
                  <ChevronDown className={cn(
                    'w-3 h-3 text-neutral-400 transition-transform group-hover:text-neutral-500',
                    isCollapsed && '-rotate-90'
                  )} />
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                            active
                              ? 'bg-neutral-100 text-neutral-900'
                              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                          )}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          {item.count !== undefined && item.count > 0 && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                              {item.count}
                            </span>
                          )}
                          {item.badge && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 animate-pulse-dot">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Separator />

        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name="Zakaria Sabti" size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-700 truncate">Zakaria Sabti</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
