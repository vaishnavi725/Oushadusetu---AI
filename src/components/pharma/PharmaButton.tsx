import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/format';

export interface PharmaButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
  loading?: boolean;
}

export function PharmaButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className,
  loading = false,
  disabled,
  ...props
}: PharmaButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--pharmalink-primary)] text-white shadow-[0_4px_14px_0_var(--pharmalink-glow)] hover:bg-[var(--pharmalink-primary-hover)] hover:shadow-[0_8px_24px_0_rgba(13,148,136,0.35)]',
    secondary:
      'bg-white/85 text-[var(--pharmalink-text-primary)] border border-[var(--pharmalink-border)] hover:bg-white hover:border-[var(--pharmalink-primary)] hover:text-[var(--pharmalink-primary)] shadow-sm hover:shadow-[0_4px_16px_rgba(13,148,136,0.12)]',
    ghost:
      'bg-transparent text-[var(--pharmalink-text-secondary)] hover:text-[var(--pharmalink-primary)] hover:bg-[var(--pharmalink-primary-soft)]',
    soft:
      'bg-[var(--pharmalink-primary-soft)] text-[var(--pharmalink-primary)] hover:bg-[var(--pharmalink-primary)] hover:text-white',
  }[variant];

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses,
        variantClasses,
        className
      )}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {loading ? (
        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
