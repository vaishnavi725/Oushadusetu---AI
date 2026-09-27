import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/format';

export interface PharmaNavItem {
  to: string;
  label: string;
  icon?: ReactNode;
  end?: boolean;
}

export function PharmaNavigation({
  items,
  className,
}: {
  items: PharmaNavItem[];
  className?: string;
}) {
  return (
    <nav className={cn('flex flex-col space-y-1', className)} aria-label="PharmaLink Navigation">
      {items.map((item, idx) => (
        <motion.div
          key={item.to}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03, duration: 0.3 }}
        >
          <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 select-none',
                isActive
                  ? 'bg-[var(--pharmalink-primary-soft)] text-[var(--pharmalink-primary)] font-bold shadow-sm border border-[var(--pharmalink-border)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                {item.icon && (
                  <span
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-[var(--pharmalink-primary)]' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-[var(--pharmalink-primary)] shadow-[0_0_8px_var(--pharmalink-glow)]" />
                )}
              </>
            )}
          </NavLink>
        </motion.div>
      ))}
    </nav>
  );
}
