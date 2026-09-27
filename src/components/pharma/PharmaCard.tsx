import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/format';

export interface PharmaCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  surface?: 'default' | 'elevated' | 'glass' | 'cinematic';
}

export function PharmaCard({
  children,
  className,
  hoverEffect = true,
  glow = false,
  surface = 'default',
  ...props
}: PharmaCardProps) {
  const surfaceClasses = {
    default: 'bg-[var(--pharmalink-surface)] border-[var(--pharmalink-border-soft)]',
    elevated: 'bg-[var(--pharmalink-surface-elevated)] border-[var(--pharmalink-border)]',
    glass: 'bg-white/70 backdrop-blur-xl border-white/80 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)]',
    cinematic: 'bg-[var(--pharmalink-dark-surface)] border-[var(--pharmalink-dark-border)] text-white backdrop-blur-xl',
  }[surface];

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -4,
              scale: 1.008,
              transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300',
        'shadow-[0_4px_20px_-2px_rgba(15,23,42,0.04)]',
        surfaceClasses,
        glow && 'hover:shadow-[0_16px_36px_-6px_var(--pharmalink-glow)] hover:border-[var(--pharmalink-border)]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PharmaCardHeader({
  title,
  subtitle,
  badge,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-4 border-b border-slate-100/80 mb-5', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="size-10 rounded-xl bg-[var(--pharmalink-primary-soft)] text-[var(--pharmalink-primary)] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
