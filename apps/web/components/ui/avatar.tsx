import * as React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  emoji?: string;
  department?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const emojiSizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

function Avatar({ name, emoji, department, size = 'md', src, className, ...props }: AvatarProps) {
  const initials = getInitials(name);

  if (src) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden shrink-0',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (emoji) {
    return (
      <div
        className={cn(
          'relative rounded-full shrink-0 flex items-center justify-center bg-neutral-100 border border-neutral-300',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <span className={emojiSizes[size]}>{emoji}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-full shrink-0 flex items-center justify-center font-semibold text-neutral-600 bg-neutral-100 border border-neutral-300',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
