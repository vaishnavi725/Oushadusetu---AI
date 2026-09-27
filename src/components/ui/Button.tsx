import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';
import { PillSpinner } from './PillLoader';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'success';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loaderType?: 'pill' | 'spinner';
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-white shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_6px_16px_-6px_rgb(15_118_110/0.45)] hover:bg-brand-800 hover:shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_10px_22px_-8px_rgb(15_118_110/0.55)] active:bg-brand-900',
  secondary: 'border border-slate-200 bg-white text-ink-900 hover:border-brand-400 hover:bg-brand-50 active:bg-brand-100',
  ghost: 'text-ink-700 hover:bg-brand-50 hover:text-brand-800 active:bg-brand-100',
  subtle: 'bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200 border border-brand-200/60',
  danger: 'bg-bad-600 text-white hover:bg-bad-700 shadow-[0_6px_16px_-6px_rgb(187_58_51/0.55)]',
  success: 'bg-ok-600 text-white hover:bg-ok-700 shadow-[0_6px_16px_-6px_rgb(27_127_80/0.5)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, loaderType = 'pill', icon, iconRight, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap rounded-[var(--radius-input)] font-medium transition-all duration-200 ease-out',
        'hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        loaderType === 'pill' ? (
          <PillSpinner size={size === 'lg' ? 'sm' : 'xs'} />
        ) : (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        )
      ) : (
        icon
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
});
