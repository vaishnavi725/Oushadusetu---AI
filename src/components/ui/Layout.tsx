import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/format';

export function Card({ children, className, as: As = 'section', ...rest }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article' } & Record<string, unknown>) {
  return (
    <As className={cn('pharma-card', className)} {...rest}>
      {children}
    </As>
  );
}

export function CardHeader({ title, description, action, icon }: { title: ReactNode; description?: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[rgba(77,163,255,0.18)] px-6 py-4">
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 text-[#00D9FF]">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#F5FAFF] tracking-tight">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-[#A2C0E8]">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[#087BFF]/15 text-[#00D9FF] border border-[rgba(0,217,255,0.3)] shadow-[0_0_12px_rgba(0,217,255,0.2)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-[#F5FAFF] sm:text-3xl font-display">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-[#A2C0E8] leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </motion.header>
  );
}

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) return null;
  return (
    <nav className="mt-4 flex items-center justify-between text-sm text-[#A2C0E8]" aria-label="Pagination">
      <span>
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} className="rounded-md p-2 hover:bg-[#06245A] disabled:opacity-40" aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </button>
        <span className="px-2 font-medium text-[#F5FAFF]">
          {page} / {pages}
        </span>
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} className="rounded-md p-2 hover:bg-[#06245A] disabled:opacity-40" aria-label="Next page">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { value: T; label: ReactNode; count?: number }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer',
              active
                ? 'bg-[#087BFF] text-[#F5FAFF] shadow-[0_0_18px_rgba(0,217,255,0.4)] border border-[#00D9FF]/40'
                : 'text-[#A2C0E8] hover:text-[#00D9FF] hover:bg-[#06245A]/80 bg-[#06245A]/40 border border-[rgba(77,163,255,0.18)]'
            )}
          >
            <span className="flex items-center gap-1.5">
              {t.label}
              {t.count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                    active ? 'bg-white/20 text-[#F5FAFF]' : 'bg-[#09347d]/80 text-[#A2C0E8]'
                  )}
                >
                  {t.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function KeyValue({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] font-medium uppercase tracking-wide text-[#749BC9]">{label}</dt>
      <dd className={cn('mt-0.5 truncate text-sm text-[#F5FAFF]', mono && 'font-mono text-[13px]')}>{children}</dd>
    </div>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img
        src="/images/oushadha-icon.png"
        alt="OushadhaSetu"
        className="size-8 shrink-0 object-contain rounded-lg shadow-[0_0_12px_rgba(0,217,255,0.35)]"
      />
      {!compact && (
        <span className="flex flex-col">
          <span className="font-display text-[17px] font-bold tracking-tight text-[#F5FAFF] leading-tight">
            <span>Oushadha</span>
            <span className="text-[#00D9FF]">Setu</span>
          </span>
          <span className="text-[10px] font-medium tracking-wide text-[#4DA3FF] uppercase leading-none">
            Prescription Bridge
          </span>
        </span>
      )}
    </span>
  );
}

