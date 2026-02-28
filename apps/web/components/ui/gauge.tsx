import { cn } from '@/lib/utils';

interface GaugeProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const sizeConfig = {
  sm: { dimension: 64, strokeWidth: 5, fontSize: 'text-xs' },
  md: { dimension: 96, strokeWidth: 6, fontSize: 'text-lg' },
  lg: { dimension: 128, strokeWidth: 7, fontSize: 'text-2xl' },
};

const colorConfig = {
  default: 'stroke-neutral-50',
  success: 'stroke-emerald-400',
  warning: 'stroke-amber-400',
  danger: 'stroke-red-400',
};

export function Gauge({ value, max = 100, size = 'md', label, color = 'default', className }: GaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference * (1 - percentage);

  const autoColor = percentage > 0.8 ? 'danger' : percentage > 0.6 ? 'warning' : color === 'default' ? 'success' : color;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: config.dimension, height: config.dimension }}>
        <svg width={config.dimension} height={config.dimension} className="-rotate-90">
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            className="stroke-neutral-800"
          />
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn('transition-all duration-700 ease-out', colorConfig[autoColor])}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-neutral-50', config.fontSize)}>
            {Math.round(percentage * 100)}%
          </span>
        </div>
      </div>
      {label && <span className="text-xs text-neutral-500">{label}</span>}
    </div>
  );
}
