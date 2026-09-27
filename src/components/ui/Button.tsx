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
    'bg-gradient-to-r from-[#087BFF] via-[#0066e6] to-[#087BFF] text-[#F5FAFF] font-bold border border-[#00D9FF]/40 shadow-[0_4px_16px_rgba(0,217,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#0066e6] hover:to-[#087BFF] hover:border-[#00D9FF] hover:shadow-[0_6px_22px_rgba(0,217,255,0.5)] active:scale-[0.98]',
  secondary:
    'border border-[rgba(0,217,255,0.4)] bg-[#06245A]/80 text-[#F5FAFF] font-semibold backdrop-blur-md hover:border-[#00D9FF] hover:bg-[#087BFF]/25 hover:text-[#FFFFFF] active:bg-[#087BFF]/35 shadow-[0_2px_10px_rgba(3,19,47,0.4)]',
  ghost: 'text-[#B8C7D9] hover:bg-[#06245A]/80 hover:text-[#F5FAFF] active:bg-[#06245A]',
  subtle: 'bg-[#087BFF]/20 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#087BFF]/30 hover:text-[#F5FAFF] active:bg-[#087BFF]/40 font-semibold',
  danger: 'bg-bad-600 text-white hover:bg-bad-700 shadow-[0_6px_16px_-6px_rgb(239_68_68/0.6)] font-bold',
  success: 'bg-ok-600 text-white hover:bg-ok-700 shadow-[0_6px_16px_-6px_rgb(16_185_129/0.6)] font-bold',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-[13px] gap-1.5 font-semibold',
  md: 'h-10 px-4.5 text-[14.5px] gap-2 font-semibold',
  lg: 'h-12 px-6 text-[16px] gap-2.5 font-bold',
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
