'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const modalOverlayVariants = cva(
  'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4',
  {
    variants: {
      animate: {
        true: 'animate-fade-in',
        false: '',
      },
    },
    defaultVariants: {
      animate: true,
    },
  }
);

const modalContentVariants = cva(
  'relative w-full bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[90vw]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

interface ModalProps extends VariantProps<typeof modalContentVariants> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function Modal({ open, onClose, size, children, className }: ModalProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handler);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handler);
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={modalOverlayVariants()} onClick={onClose}>
      <div
        className={cn(modalContentVariants({ size }), 'animate-slide-up', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ className, children, onClose, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div className={cn('flex items-center justify-between p-6 pb-0', className)} {...props}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ModalTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold text-neutral-50', className)} {...props} />;
}

function ModalDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-neutral-400 mt-1', className)} {...props} />;
}

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 overflow-y-auto scrollbar-thin', className)} {...props} />;
}

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-3 p-6 pt-0', className)} {...props} />;
}

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };
