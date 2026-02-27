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
      { label: 'Approvals', href: '/dashboard/approvals', icon: CheckCircle, count: pendingApprovals },
      { label: 'Escalations', href: '/dashboard/escalations', icon: AlertTriangle, count: openEscalations },
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
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[240px] flex flex-col',
          'bg-neutral-950 border-r border-neutral-800',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="text-sm font-bold tracking-[0.2em] text-neutral-50 uppercase">
              JourneyMan
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
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
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-neutral-800 text-neutral-50'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {'count' in item && item.count! > 0 && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
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

        <Separator />

        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name="Zakaria Sabti" size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">Zakaria Sabti</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
