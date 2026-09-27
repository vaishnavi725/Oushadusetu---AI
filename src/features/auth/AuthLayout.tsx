import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { OushadhaLogo } from '@/features/landing/OushadhaLogo';
import { REFILL_SCENES } from '@/features/landing/refill-scenes';

interface AuthLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  below?: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, description, eyebrow, children, below, footer }: AuthLayoutProps) {
  const [index, setIndex] = useState(1);
  const scene = REFILL_SCENES[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % REFILL_SCENES.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="auth-mesh relative hidden overflow-hidden text-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-14">
        <Link to="/" className="relative w-fit rounded-lg">
          <OushadhaLogo size="md" showSubtitle={false} />
        </Link>

        <div className="relative max-w-md">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-800">One case. One owner. One next step.</p>
          <blockquote className="mt-4 font-display text-[34px] font-semibold leading-[1.12] tracking-tight text-slate-950 xl:text-[40px]">
            The refill keeps moving, even when the chart does not.
          </blockquote>

          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-teal-800">{scene.caseId}</p>
                <p className="text-[12px] text-slate-500">{scene.priority}</p>
              </div>
              <p className="mt-2 font-display text-xl font-semibold">{scene.state}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{scene.blocker}</p>
              <p className="mt-3 text-[13px] text-teal-800">
                Next: {scene.owner} · {scene.next}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="relative inline-flex items-center gap-2 text-[13px] text-slate-600">
          <ShieldCheck className="size-4 text-teal-700" aria-hidden />
          Clinical decisions stay with a person. Every change is audited.
        </p>
      </aside>

      <main className="relative flex min-h-screen flex-col bg-[#f6f7f4] px-4 py-6 sm:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_320px_at_100%_0%,rgba(15,118,110,0.08),transparent_60%)]" aria-hidden />
        <div className="relative flex items-center justify-between gap-4">
          <Link to="/" className="rounded-lg lg:hidden">
            <span className="font-display text-[17px] font-semibold tracking-tight text-slate-900">
              Oushadha<span className="text-teal-700">Setu</span>
            </span>
          </Link>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 rounded-md px-1 text-[13px] font-medium text-slate-600 transition-colors hover:text-slate-950">
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to home
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] sm:p-8"
          >
            {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-700">{eyebrow}</p>}
            <h1 className="mt-1.5 text-[26px] leading-tight text-slate-950 sm:text-[28px]">{title}</h1>
            {description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>}
            <div className="mt-6">{children}</div>
          </motion.div>
          {footer && <div className="mt-5 text-center text-sm text-slate-600">{footer}</div>}
          {below && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }} className="mt-6">
              {below}
            </motion.div>
          )}
        </div>
        <p className="relative text-center text-[12px] text-slate-500">Synthetic demo data only. Not for clinical use.</p>
      </main>
    </div>
  );
}
