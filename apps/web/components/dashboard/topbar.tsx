'use client';

import { Bell, Menu, Search, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface TopbarProps {
  onMenuClick: () => void;
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [];

  if (segments[0] === 'dashboard') {
    crumbs.push({ label: 'Dashboard', href: '/dashboard' });

    if (segments[1]) {
      const labels: Record<string, string> = {
        employees: 'Employees',
        hire: 'Hire New Employee',
        approvals: 'Approvals',
        escalations: 'Escalations',
        knowledge: 'Knowledge Base',
        settings: 'Settings',
      };
      crumbs.push({ label: labels[segments[1]] || segments[1] });

      if (segments[1] === 'settings' && segments[2] === 'integrations') {
        crumbs[crumbs.length - 1].href = '/dashboard/settings';
        crumbs.push({ label: 'Integrations' });
      }

      if (segments[1] === 'employees' && segments[2]) {
        crumbs[crumbs.length - 1].href = '/dashboard/employees';
        crumbs.push({ label: 'Employee Profile' });
      }
    }
  }

  return crumbs;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 flex items-center border-b border-surface-800/50 bg-surface-900/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden sm:flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-surface-600" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <a
                href={crumb.href}
                className="text-surface-500 hover:text-surface-300 transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className={cn(i === crumbs.length - 1 ? 'text-surface-200 font-medium' : 'text-surface-500')}>
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 flex justify-center px-4">
        <button className="flex items-center gap-2.5 w-full max-w-md px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-500 hover:text-surface-400 hover:bg-surface-800 hover:border-surface-600 transition-all text-sm">
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search employees, tasks, knowledge...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-surface-700 bg-surface-800 px-1.5 py-0.5 text-[10px] font-mono text-surface-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        </button>

        {/* User avatar */}
        <div className="hidden sm:block">
          <Avatar name="Zakaria Sabti" size="sm" department="Executive" />
        </div>
      </div>
    </header>
  );
}
