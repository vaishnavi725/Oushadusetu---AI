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
    'bg-gradient-to-r from-[#087BFF] to-[#0066e6] text-[#F5FAFF] font-semibold shadow-[0_4px_16px_rgba(0,217,255,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-[#00D9FF] hover:to-[#087BFF] hover:text-[#03132F] hover:shadow-[0_6px_22px_rgba(0,217,255,0.5)] active:scale-[0.98]',
  secondary:
    'border border-[rgba(0,217,255,0.28)] bg-[#06245A]/75 text-[#F5FAFF] backdrop-blur-md hover:border-[#00D9FF] hover:bg-[#087BFF]/25 hover:text-[#00D9FF] active:bg-[#087BFF]/35',
  ghost: 'text-[#A2C0E8] hover:bg-[#06245A]/70 hover:text-[#00D9FF] active:bg-[#06245A]',
  subtle: 'bg-[#087BFF]/15 text-[#4DA3FF] hover:bg-[#087BFF]/25 hover:text-[#F5FAFF] active:bg-[#087BFF]/35',
  danger: 'bg-bad-600 text-white hover:bg-bad-700 shadow-[0_6px_16px_-6px_rgb(239_68_68/0.6)]',
  success: 'bg-ok-600 text-white hover:bg-ok-700 shadow-[0_6px_16px_-6px_rgb(16_185_129/0.6)]',
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
