'use client';

import { Bell, Settings, CheckCircle, AlertTriangle, Zap, Users, Shield, ChevronRight, Archive, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
}

const allNotifications: Notification[] = [
  { id: 'n-1', type: 'approval_requested', title: 'Approval Required', description: 'Nova wants to send a proposal to CloudVault Inc.', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), read: false, priority: 'high' },
  { id: 'n-2', type: 'escalation_created', title: 'Escalation: Data Compliance', description: 'Atlas flagged a GDPR question.', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), read: false, priority: 'high' },
  { id: 'n-3', type: 'task_completed', title: 'Task Completed', description: 'Apex finished Q1 Pipeline Analysis.', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), read: false, priority: 'medium' },
  { id: 'n-4', type: 'milestone', title: 'Milestone!', description: 'Nova completed 1,000 tasks.', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), read: true, priority: 'low' },
  { id: 'n-5', type: 'status_change', title: 'Employee Promoted', description: 'Ember promoted to Semi-Autonomous.', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), read: true, priority: 'medium' },
  { id: 'n-6', type: 'handoff_pending', title: 'Handoff Pending', description: 'Sage → Flux: Market Research handoff.', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), read: true, priority: 'medium' },
  { id: 'n-7', type: 'system_alert', title: 'Integration Warning', description: 'HubSpot sync failed 3 times.', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), read: true, priority: 'high' },
  { id: 'n-8', type: 'task_completed', title: 'Task Completed', description: 'Flux published new blog post.', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), read: true, priority: 'low' },
  { id: 'n-9', type: 'task_completed', title: 'Task Completed', description: 'Atlas completed vendor follow-ups.', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), read: true, priority: 'low' },
  { id: 'n-10', type: 'milestone', title: 'Weekly Milestone', description: 'Team completed 200+ tasks this week.', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), read: true, priority: 'low' },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  approval_requested: CheckCircle,
  escalation_created: AlertTriangle,
  task_completed: Zap,
  status_change: Users,
  system_alert: Shield,
  handoff_pending: ChevronRight,
  milestone: Zap,
};

const typeColors: Record<string, string> = {
  approval_requested: 'text-amber-400',
  escalation_created: 'text-red-400',
  task_completed: 'text-emerald-400',
  status_change: 'text-blue-400',
  system_alert: 'text-red-400',
  handoff_pending: 'text-neutral-400',
  milestone: 'text-amber-400',
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Bell className="w-6 h-6" />
            All Notifications
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Complete notification history and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4" />
            Archive All Read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
            Preferences
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {allNotifications.map((notif) => {
          const Icon = typeIcons[notif.type];
          return (
            <Card key={notif.id} className={cn(!notif.read && 'bg-neutral-800/20')}>
              <CardContent className="py-4 flex items-center gap-4">
                <div className={cn('shrink-0', typeColors[notif.type])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-sm font-medium', notif.read ? 'text-neutral-400' : 'text-neutral-50')}>
                      {notif.title}
                    </p>
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    <Badge variant="secondary" className="text-[10px]">{notif.priority}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{notif.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(notif.timestamp)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
