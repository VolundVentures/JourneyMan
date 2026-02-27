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
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50',
  },
  onboarding: {
    label: 'Onboarding',
    dotClass: 'bg-neutral-400',
    badgeClass: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  },
  supervised: {
    label: 'Supervised',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-950/50 text-amber-400 border-amber-900/50',
  },
  paused: {
    label: 'Paused',
    dotClass: 'bg-neutral-600',
    badgeClass: 'bg-neutral-800/50 text-neutral-500 border-neutral-800',
  },
  terminated: {
    label: 'Terminated',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-950/50 text-red-400 border-red-900/50',
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
            'rounded-full',
            dotSizes[size],
            config.dotClass
          )}
        />
      )}
      {config.label}
    </span>
  );
}
