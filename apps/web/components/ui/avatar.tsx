import * as React from 'react';
import { cn } from '@/lib/utils';
import { getInitials, getDepartmentColor } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
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

function Avatar({ name, department, size = 'md', src, className, ...props }: AvatarProps) {
  const initials = getInitials(name);
  const gradient = department ? getDepartmentColor(department) : 'from-brand-500 to-brand-700';

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

  return (
    <div
      className={cn(
        'relative rounded-full shrink-0 flex items-center justify-center font-heading font-semibold text-white bg-gradient-to-br shadow-lg',
        sizeClasses[size],
        gradient,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
