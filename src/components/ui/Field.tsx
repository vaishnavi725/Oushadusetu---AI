import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/format';

const control =
  'w-full rounded-[var(--radius-input)] border bg-[#06245A]/60 px-3 text-sm text-[#F5FAFF] placeholder:text-[#5076A8] transition-all duration-150 focus:outline-none focus:ring-4 disabled:bg-[#03132F]/50 disabled:text-[#5076A8] backdrop-blur-md';
const ok = 'border-[rgba(0,217,255,0.25)] hover:border-[#00D9FF]/70 focus:border-[#00D9FF] focus:ring-[rgba(0,217,255,0.22)]';
const bad = 'border-bad-600 focus:border-bad-600 focus:ring-bad-500/20';

interface FieldShellProps {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelAction?: ReactNode;
}

export function FieldShell({ label, htmlFor, hint, error, required, children, className, labelAction }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink-700">
          {label}
          {required && <span className="ml-0.5 text-bad-600" aria-hidden>*</span>}
        </label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="flex items-center gap-1 text-[12.5px] text-bad-700">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-[12.5px] text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; error?: string; shellClassName?: string; labelAction?: ReactNode; leading?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, hint, error, id, required, className, shellClassName, labelAction, leading, ...rest }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell label={label} htmlFor={fid} hint={hint} error={error} required={required} className={shellClassName} labelAction={labelAction}>
      <div className="relative">
        {leading && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">{leading}</span>}
        <input
          ref={ref}
          id={fid}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
          className={cn(control, 'h-10', leading && 'pl-9', error ? bad : ok, className)}
          {...rest}
        />
      </div>
    </FieldShell>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: ReactNode; error?: string; shellClassName?: string; labelAction?: ReactNode };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, hint, error, id, required, className, shellClassName, labelAction, ...rest }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell label={label} htmlFor={fid} hint={hint} error={error} required={required} className={shellClassName} labelAction={labelAction}>
      <textarea
        ref={ref}
        id={fid}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
        className={cn(control, 'min-h-24 py-2.5 leading-relaxed', error ? bad : ok, className)}
        {...rest}
      />
    </FieldShell>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: ReactNode; error?: string; shellClassName?: string; hideLabel?: boolean };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, hint, error, id, required, className, shellClassName, children, hideLabel, ...rest }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  const select = (
    <select
      ref={ref}
      id={fid}
      required={required}
      aria-invalid={Boolean(error) || undefined}
      aria-label={hideLabel ? label : undefined}
      className={cn(control, 'h-10 cursor-pointer appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9', error ? bad : ok, className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23647c85' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
      {...rest}
    >
      {children}
    </select>
  );
  if (hideLabel) return select;
  return (
    <FieldShell label={label} htmlFor={fid} hint={hint} error={error} required={required} className={shellClassName}>
      {select}
    </FieldShell>
  );
});

export function Checkbox({ label, description, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; description?: ReactNode }) {
  const id = useId();
  return (
    <label htmlFor={rest.id ?? id} className={cn('flex cursor-pointer items-start gap-2.5 text-sm', className)}>
      <input id={rest.id ?? id} type="checkbox" className="mt-0.5 size-4 cursor-pointer rounded border-line-strong accent-brand-700" {...rest} />
      <span>
        <span className="text-ink-900">{label}</span>
        {description && <span className="block text-[12.5px] text-ink-500">{description}</span>}
      </span>
    </label>
  );
}
