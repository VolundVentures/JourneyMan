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

function AnimatedCounter({ value, duration = 800 }: { value: number; duration?: number }) {
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
  subtitle,
  pulseOnPositive,
}: StatCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:bg-neutral-900/80">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-lg font-semibold text-neutral-400">{prefix}</span>
            )}
            <span className="text-3xl font-bold text-neutral-50 tabular-nums">
              <AnimatedCounter value={value} />
            </span>
            {suffix && (
              <span className="text-lg font-semibold text-neutral-400">{suffix}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500">{subtitle}</p>
          )}
        </div>
        <div className="rounded-lg p-2.5 bg-neutral-800 text-neutral-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {!trendNeutral && (
            trendPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            )
          )}
          <span
            className={cn(
              'text-xs font-mono font-medium',
              trendPositive ? 'text-emerald-500' : trendNeutral ? 'text-neutral-500' : 'text-red-500'
            )}
          >
            {trendPositive && '+'}
            {trend.value}%
          </span>
          <span className="text-xs text-neutral-500">{trend.label}</span>
          {pulseOnPositive && value > 0 && (
            <span className="ml-auto w-2 h-2 rounded-full bg-neutral-400 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
