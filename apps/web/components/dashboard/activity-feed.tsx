'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Play,
  AlertTriangle,
  AlertOctagon,
  Search,
  Mail,
  BookOpen,
  Calendar,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import type { ActivityEntry } from '@journeyman/shared';
import { mockEmployees } from '@/lib/mock-data';

const iconMap: Record<string, React.ElementType> = {
  'check-circle': CheckCircle,
  play: Play,
  'alert-triangle': AlertTriangle,
  'alert-octagon': AlertOctagon,
  search: Search,
  mail: Mail,
  'book-open': BookOpen,
  calendar: Calendar,
  send: Send,
};

const iconColors: Record<string, string> = {
  'check-circle': 'text-success-400',
  play: 'text-accent-400',
  'alert-triangle': 'text-warning-400',
  'alert-octagon': 'text-destructive-400',
  search: 'text-brand-400',
  mail: 'text-brand-400',
  'book-open': 'text-accent-400',
  calendar: 'text-brand-400',
  send: 'text-success-400',
};

interface ActivityFeedProps {
  activities: ActivityEntry[];
  limit?: number;
}

export function ActivityFeed({ activities, limit = 6 }: ActivityFeedProps) {
  const [expanded, setExpanded] = useState(false);
  const displayed = expanded ? activities : activities.slice(0, limit);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-surface-200">Recent Activity</h3>
        {activities.length > limit && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-surface-500 hover:text-surface-300 transition-colors"
          >
            {expanded ? 'Show Less' : `Show All (${activities.length})`}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-surface-800" />

        <div className="space-y-0.5">
          {displayed.map((activity, i) => {
            const IconComponent = iconMap[activity.icon] || CheckCircle;
            const iconColor = iconColors[activity.icon] || 'text-surface-400';
            const employee = mockEmployees.find((e) => e.id === activity.employeeId);

            return (
              <div
                key={activity.id}
                className={cn(
                  'relative flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-800/30',
                  i === 0 && 'animate-slide-up'
                )}
              >
                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface-800 border border-surface-700/50 shrink-0">
                  <IconComponent className={cn('w-4 h-4', iconColor)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-surface-300">
                    <span className="font-medium text-surface-200">{activity.employeeName}</span>
                    {' · '}
                    {activity.description}
                  </p>
                  <p className="text-[10px] text-surface-500 mt-0.5 font-mono">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
