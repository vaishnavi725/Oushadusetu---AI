import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PharmaCard } from './PharmaCard';
import { AnimatedNumber } from './AnimatedNumber';
import { cn } from '@/lib/format';

export interface PharmaStatProps {
  label: string;
  value: number | string;
  isNumeric?: boolean;
  numericVal?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  icon?: ReactNode;
  progressPercent?: number;
  className?: string;
}

export function PharmaStat({
  label,
  value,
  isNumeric = false,
  numericVal,
  prefix = '',
  suffix = '',
  decimals = 0,
  delta,
  trend = 'up',
  subtext,
  icon,
  progressPercent,
  className,
}: PharmaStatProps) {
  return (
    <PharmaCard className={cn('p-5 flex flex-col justify-between', className)} glow>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/70">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            {label}
          </span>
          {icon && (
            <div className="size-9 rounded-xl bg-[var(--pharmalink-primary-soft)] text-[var(--pharmalink-primary)] flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {isNumeric && typeof numericVal === 'number' ? (
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              <AnimatedNumber
                value={numericVal}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
              />
            </span>
          ) : (
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {value}
            </span>
          )}

          {delta && (
            <span
              className={cn(
                'inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded-full',
                trend === 'up'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : trend === 'down'
                  ? 'text-rose-700 bg-rose-50 border border-rose-200'
                  : 'text-slate-600 bg-slate-100'
              )}
            >
              {trend === 'up' ? (
                <TrendingUp className="size-3 mr-0.5" />
              ) : trend === 'down' ? (
                <TrendingDown className="size-3 mr-0.5" />
              ) : null}
              {delta}
            </span>
          )}
        </div>
      </div>

      {progressPercent !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[var(--pharmalink-primary)] rounded-full"
            />
          </div>
        </div>
      )}

      {subtext && (
        <p className="mt-2 text-xs text-slate-400 font-mono">
          {subtext}
        </p>
      )}
    </PharmaCard>
  );
}
