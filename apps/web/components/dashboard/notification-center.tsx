'use client';

import * as React from 'react';
import {
  Bell, CheckCircle, AlertTriangle, Zap, Users, X,
  Clock, Archive, Check, ChevronRight, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'approval_requested' | 'escalation_created' | 'task_completed' | 'status_change' | 'system_alert' | 'handoff_pending' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  href?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'approval_requested',
    title: 'Approval Required',
    description: 'Nova wants to send a proposal to CloudVault Inc. — $48,000 annual contract.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    read: false,
    priority: 'high',
    href: '/dashboard/approvals',
  },
  {
    id: 'notif-2',
    type: 'escalation_created',
    title: 'Escalation: Data Compliance',
    description: 'Atlas flagged a GDPR-related question from a prospect that requires legal review.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    priority: 'high',
    href: '/dashboard/escalations',
  },
  {
    id: 'notif-3',
    type: 'task_completed',
    title: 'Task Completed',
    description: 'Apex finished "Q1 Pipeline Analysis" — 47 leads qualified, 12 high-priority.',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    read: false,
    priority: 'medium',
  },
  {
    id: 'notif-4',
    type: 'milestone',
    title: 'Milestone Reached!',
    description: 'Nova has successfully completed 1,000 tasks since joining the team.',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
    priority: 'low',
  },
  {
    id: 'notif-5',
    type: 'status_change',
    title: 'Employee Status Change',
    description: 'Ember has been promoted from Supervised to Semi-Autonomous after passing calibration.',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    read: true,
    priority: 'medium',
  },
  {
    id: 'notif-6',
    type: 'handoff_pending',
    title: 'Handoff Pending',
    description: 'Sage wants to hand off "Market Research: FinTech Trends" to Flux for content creation.',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    read: true,
    priority: 'medium',
    href: '/dashboard/handoffs',
  },
  {
    id: 'notif-7',
    type: 'system_alert',
    title: 'Integration Warning',
    description: 'HubSpot sync failed 3 times in the last hour. Check connection settings.',
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    read: true,
    priority: 'high',
    href: '/dashboard/integrations',
  },
];

const typeIcons: Record<Notification['type'], React.ComponentType<{ className?: string }>> = {
  approval_requested: CheckCircle,
  escalation_created: AlertTriangle,
  task_completed: Zap,
  status_change: Users,
  system_alert: Shield,
  handoff_pending: ChevronRight,
  milestone: Zap,
};

const typeColors: Record<Notification['type'], string> = {
  approval_requested: 'text-amber-600',
  escalation_created: 'text-red-600',
  task_completed: 'text-emerald-600',
  status_change: 'text-blue-600',
  system_alert: 'text-red-600',
  handoff_pending: 'text-neutral-500',
  milestone: 'text-amber-600',
};

export function NotificationCenter() {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<'priority' | 'all' | 'archived'>('priority');
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const ref = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = React.useMemo(() => {
    if (tab === 'priority') return notifications.filter((n) => !n.read || n.priority === 'high');
    if (tab === 'archived') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, tab]);

  const tabs = [
    { key: 'priority' as const, label: 'Priority' },
    { key: 'all' as const, label: 'All' },
    { key: 'archived' as const, label: 'Archived' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neutral-900 text-neutral-50 text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-96 rounded-xl border border-neutral-200 bg-white shadow-2xl animate-fade-in z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-neutral-500 hover:text-neutral-600 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-neutral-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex-1 py-2 text-xs font-medium transition-colors border-b-2',
                  tab === t.key
                    ? 'text-neutral-900 border-neutral-900'
                    : 'text-neutral-500 border-transparent hover:text-neutral-600'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Archive className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No notifications</p>
              </div>
            ) : (
              filtered.map((notif) => {
                const Icon = typeIcons[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={cn(
                      'flex items-start gap-3 w-full px-4 py-3 text-left border-b border-neutral-200 last:border-0 transition-colors',
                      notif.read ? 'bg-transparent' : 'bg-neutral-50',
                      'hover:bg-neutral-100'
                    )}
                  >
                    <div className={cn('mt-0.5 shrink-0', typeColors[notif.type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn('text-sm font-medium truncate', notif.read ? 'text-neutral-500' : 'text-neutral-900')}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notif.description}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] text-neutral-400">{formatRelativeTime(notif.timestamp)}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-neutral-200 p-2">
            <a
              href="/dashboard/notifications"
              className="flex items-center justify-center gap-1 py-1.5 text-xs text-neutral-500 hover:text-neutral-600 transition-colors rounded-lg hover:bg-neutral-100"
            >
              View all notifications <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
