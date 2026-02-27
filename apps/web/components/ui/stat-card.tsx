'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: { value: number; label: string };
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  pulseOnPositive?: boolean;
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const increment = Math.max(Math.ceil(end / (duration / stepTime)), 1);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display}</>;
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  trend,
  icon: Icon,
  iconColor = 'text-brand-400 bg-brand-500/10',
  subtitle,
  pulseOnPositive,
}: StatCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div className="relative group rounded-xl border border-surface-700/50 bg-surface-800/30 backdrop-blur-sm p-5 transition-all duration-300 hover:border-surface-600/50 hover:bg-surface-800/50">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-surface-500">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-lg font-heading font-semibold text-surface-300">{prefix}</span>
            )}
            <span className="text-3xl font-heading font-bold text-surface-100 tabular-nums">
              <AnimatedCounter value={value} />
            </span>
            {suffix && (
              <span className="text-lg font-heading font-semibold text-surface-300">{suffix}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-surface-500">{subtitle}</p>
          )}
        </div>
        <div className={cn('rounded-xl p-2.5', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {!trendNeutral && (
            trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-success-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-destructive-400" />
            )
          )}
          <span
            className={cn(
              'text-xs font-mono font-medium',
              trendPositive ? 'text-success-400' : trendNeutral ? 'text-surface-500' : 'text-destructive-400'
            )}
          >
            {trendPositive && '+'}
            {trend.value}%
          </span>
          <span className="text-xs text-surface-500">{trend.label}</span>
          {pulseOnPositive && value > 0 && (
            <span className="ml-auto w-2 h-2 rounded-full bg-warning-500 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
