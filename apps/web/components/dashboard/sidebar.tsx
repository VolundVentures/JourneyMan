'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Settings,
  Plug,
  X,
  Zap,
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

const navSections = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'WORKFORCE',
    items: [
      { label: 'Employees', href: '/dashboard/employees', icon: Users },
      { label: 'Hire New', href: '/dashboard/hire', icon: UserPlus },
    ],
  },
  {
    label: 'OVERSIGHT',
    items: [
      { label: 'Approvals', href: '/dashboard/approvals', icon: CheckCircle, count: pendingApprovals, countColor: 'bg-warning-500/20 text-warning-400' },
      { label: 'Escalations', href: '/dashboard/escalations', icon: AlertTriangle, count: openEscalations, countColor: 'bg-destructive-500/20 text-destructive-400' },
    ],
  },
  {
    label: 'RESOURCES',
    items: [
      { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'Integrations', href: '/dashboard/settings/integrations', icon: Plug },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col',
          'bg-surface-900/80 backdrop-blur-xl border-r border-surface-800/50',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-heading text-sm font-bold tracking-[0.15em] text-surface-100 uppercase">
              JourneyMan
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-surface-400 hover:text-surface-200 hover:bg-surface-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Separator className="bg-surface-800/50" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-surface-500">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-brand-500/10 text-brand-400 border-l-2 border-brand-500 -ml-[1px]'
                          : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                      )}
                    >
                      <item.icon className={cn('w-4 h-4 shrink-0', active && 'text-brand-400')} />
                      <span className="flex-1">{item.label}</span>
                      {'count' in item && item.count! > 0 && (
                        <span
                          className={cn(
                            'text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full',
                            item.countColor
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <Separator className="bg-surface-800/50" />

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name="Zakaria Sabti" size="sm" department="Executive" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-200 truncate">Zakaria Sabti</p>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider">Admin · Volund Ventures</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
