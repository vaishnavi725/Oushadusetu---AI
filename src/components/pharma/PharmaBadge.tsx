import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

export interface PharmaBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'soft' | 'success' | 'warning' | 'urgent' | 'neutral';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
  dot?: boolean;
}

export function PharmaBadge({
  children,
  variant = 'soft',
  size = 'md',
  icon,
  className,
  dot = false,
}: PharmaBadgeProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  }[size];

  const variantClasses = {
    primary: 'bg-[var(--pharmalink-primary)] text-white font-semibold',
    soft: 'bg-[var(--pharmalink-primary-soft)] text-[var(--pharmalink-primary)] border border-[var(--pharmalink-border)] font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
    urgent: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200 font-medium',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono transition-all',
        sizeClasses,
        variantClasses,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'size-1.5 rounded-full animate-pulse',
            variant === 'primary' ? 'bg-white' : 'bg-current'
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
