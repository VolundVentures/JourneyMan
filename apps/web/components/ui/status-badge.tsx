import { cn } from '@/lib/utils';
import type { EmployeeStatus } from '@journeyman/shared';

interface StatusBadgeProps {
  status: EmployeeStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const statusConfig: Record<EmployeeStatus, { label: string; dotClass: string; badgeClass: string }> = {
  active: {
    label: 'Active',
    dotClass: 'bg-success-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    badgeClass: 'bg-success-500/10 text-success-400 border-success-500/20',
  },
  onboarding: {
    label: 'Onboarding',
    dotClass: 'bg-brand-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]',
    badgeClass: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  },
  supervised: {
    label: 'Supervised',
    dotClass: 'bg-warning-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
    badgeClass: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
  },
  paused: {
    label: 'Paused',
    dotClass: 'bg-surface-500',
    badgeClass: 'bg-surface-700/50 text-surface-400 border-surface-600',
  },
  terminated: {
    label: 'Terminated',
    dotClass: 'bg-destructive-500',
    badgeClass: 'bg-destructive-500/10 text-destructive-400 border-destructive-500/20',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export function StatusBadge({ status, size = 'md', showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        sizeClasses[size],
        config.badgeClass
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full animate-pulse-slow',
            dotSizes[size],
            config.dotClass
          )}
        />
      )}
      {config.label}
    </span>
  );
}
