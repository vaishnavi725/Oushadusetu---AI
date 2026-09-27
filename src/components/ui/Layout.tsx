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
    <div className="flex items-start justify-between gap-3 border-b border-[rgba(0,217,255,0.22)] px-6 py-4.5">
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 text-[#00D9FF]">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#F5FAFF] tracking-tight">{title}</h3>
          {description && <p className="mt-1 text-[13.5px] text-[#B8C7D9] leading-relaxed">{description}</p>}
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
          <div className="mb-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#087BFF]/20 text-[#00D9FF] border border-[rgba(0,217,255,0.4)] shadow-[0_0_12px_rgba(0,217,255,0.25)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-[#F5FAFF] sm:text-4xl lg:text-[40px] font-display leading-tight">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-[15px] sm:text-[16px] text-[#B8C7D9] leading-relaxed font-normal">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </motion.header>
  );
}

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (total <= limit) return null;
  return (
    <nav className="mt-5 flex items-center justify-between text-[13.5px] text-[#B8C7D9]" aria-label="Pagination">
      <span>
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} className="rounded-lg p-2 hover:bg-[#06245A] disabled:opacity-40 text-[#B8C7D9] hover:text-[#00D9FF]" aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </button>
        <span className="px-2.5 font-bold text-[#F5FAFF]">
          {page} / {pages}
        </span>
        <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} className="rounded-lg p-2 hover:bg-[#06245A] disabled:opacity-40 text-[#B8C7D9] hover:text-[#00D9FF]" aria-label="Next page">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { value: T; label: ReactNode; count?: number }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-2.5 overflow-x-auto pb-1.5 [scrollbar-width:none]">
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
              'relative whitespace-nowrap px-4 py-2 text-[13px] font-bold rounded-full transition-all duration-200 cursor-pointer',
              active
                ? 'bg-[#06245A] text-[#F5FAFF] shadow-[0_0_20px_rgba(0,217,255,0.45)] border-2 border-[#00D9FF]'
                : 'text-[#B8C7D9] hover:text-[#F5FAFF] hover:bg-[#06245A]/90 bg-[#06245A]/50 border border-[rgba(0,217,255,0.25)]'
            )}
          >
            <span className="flex items-center gap-2">
              {t.label}
              {t.count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-mono font-bold',
                    active ? 'bg-[#00D9FF] text-[#03132F]' : 'bg-[#09347d]/90 text-[#E2EEFC]'
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
      <dt className="text-[13px] font-bold uppercase tracking-wider text-[#B8C7D9]">{label}</dt>
      <dd className={cn('mt-1 truncate text-[16px] font-semibold text-[#F5FAFF]', mono && 'font-mono text-[14px]')}>{children}</dd>
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

