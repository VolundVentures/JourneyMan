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
import { cn, formatRelativeTime, employeeEmojis } from '@/lib/utils';
import type { ActivityEntry } from '@journeyman/shared';

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
        <h3 className="text-lg font-semibold text-neutral-200">Recent Activity</h3>
        {activities.length > limit && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {expanded ? 'Show Less' : `Show All (${activities.length})`}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-neutral-800" />

        <div className="space-y-0.5">
          {displayed.map((activity, i) => {
            const IconComponent = iconMap[activity.icon] || CheckCircle;
            const emoji = employeeEmojis[activity.employeeId];

            return (
              <div
                key={activity.id}
                className={cn(
                  'relative flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-neutral-800/30',
                  i === 0 && 'animate-slide-up'
                )}
              >
                <div className="relative z-10 flex items-center justify-center w-[38px] h-[38px] rounded-full bg-neutral-900 border border-neutral-800 shrink-0">
                  {emoji ? (
                    <span className="text-sm">{emoji}</span>
                  ) : (
                    <IconComponent className="w-4 h-4 text-neutral-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-neutral-300">
                    <span className="font-medium text-neutral-200">{activity.employeeName}</span>
                    {' · '}
                    {activity.description}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5 font-mono">
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
