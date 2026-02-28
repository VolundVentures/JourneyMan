import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-800 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-neutral-800 bg-neutral-900 p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
      <div className="border-b border-neutral-800 p-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" className="flex-1 h-3" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-neutral-800/50 p-4 last:border-0">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} variant="text" className="flex-1 h-3" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
