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
    <header className="sticky top-0 z-30 h-14 shrink-0 flex items-center border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-sm px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      <nav className="hidden sm:flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <a
                href={crumb.href}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className={cn(i === crumbs.length - 1 ? 'text-neutral-200 font-medium' : 'text-neutral-500')}>
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="flex-1 flex justify-center px-4">
        <button className="flex items-center gap-2.5 w-full max-w-md px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-neutral-400 hover:border-neutral-700 transition-colors text-sm">
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neutral-50" />
        </button>
        <div className="hidden sm:block">
          <Avatar name="Zakaria Sabti" size="sm" />
        </div>
      </div>
    </header>
  );
}
