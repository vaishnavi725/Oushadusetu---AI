import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Activity, Lock, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAF6F0] text-slate-900 selection:bg-teal-100 selection:text-teal-950 lg:grid lg:grid-cols-12">
      {/* Left Column: Visual Clinical Command Center Stage (col-span-6 or 5) */}
      <aside className="relative hidden lg:col-span-6 xl:col-span-5 lg:flex lg:flex-col lg:justify-between p-10 xl:p-14 border-r border-[#EDE4D8] bg-gradient-to-b from-[#FFFDFB] via-[#F8F2EB] to-[#FAF6F0] overflow-hidden">
        {/* Warm Ambient Lights */}
        <div className="pointer-events-none absolute -top-16 -left-16 size-80 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-12 right-0 size-80 rounded-full bg-amber-400/10 blur-3xl" />

        {/* Top Brand & Security Status */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="relative rounded-lg focus:outline-none">
            <OushadhaLogo size="md" showSubtitle={false} />
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE4D8] px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-teal-900 border border-[#DFCFC0]">
            <Lock className="size-3 text-teal-800" />
            <span>MFA AAL2 Enforced</span>
          </div>
        </div>

        {/* Center: Clinical Team Image + Dynamic Refill Simulation */}
        <div className="relative z-10 my-auto py-8">
          <p className="text-[11.5px] font-mono font-semibold uppercase tracking-[0.16em] text-teal-800">
            Clinical Orchestration Platform
          </p>
          <h2 className="mt-2 font-display text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-950">
            Prescription refills that never stall in the dark.
          </h2>

          {/* Embedded Photographic Visual */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-[#EDE4D8] shadow-lg relative group">
            <img
              src="/images/clinical-team.jpg"
              alt="Clinical Team Dashboard Review"
              className="h-48 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4">
              <div className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs">Live Telemetry Ingest</span>
                </div>
                <span className="font-mono text-[11px] text-teal-300">Case #RX-4091</span>
              </div>
            </div>
          </div>

          {/* Dynamic Active Refill Case Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mt-5 rounded-2xl border border-[#EDE4D8] bg-white/95 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-teal-800">
                  {scene.caseId}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Activity className="size-3" />
                  {scene.priority}
                </span>
              </div>
              <p className="mt-1.5 font-display text-base font-bold text-slate-950">{scene.state}</p>
              <p className="mt-0.5 text-xs text-stone-600 truncate">{scene.blocker}</p>
              <p className="mt-2 text-xs font-semibold text-teal-900 border-t border-stone-100 pt-2 flex items-center justify-between">
                <span>Next Owner:</span>
                <span className="text-teal-800 font-mono">{scene.owner}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-600 border-t border-[#EDE4D8] pt-4">
          <span className="inline-flex items-center gap-1.5 text-teal-900 font-medium">
            <ShieldCheck className="size-4 text-teal-700" />
            Human Clinician Gate Guaranteed
          </span>
          <span className="font-mono text-[11px]">SOC 2 · HIPAA</span>
        </div>
      </aside>

      {/* Right Column: Sculpted Interactive Form Card */}
      <main className="relative flex min-h-screen flex-col justify-between px-4 py-8 sm:px-8 lg:col-span-6 xl:col-span-7 lg:py-12">
        {/* Navigation Bar */}
        <div className="relative flex items-center justify-between gap-4">
          <Link to="/" className="lg:hidden">
            <OushadhaLogo size="sm" showSubtitle={false} />
          </Link>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-stone-400 hover:text-slate-950 shadow-sm"
          >
            <ArrowLeft className="size-3.5" />
            Back to Overview
          </Link>
        </div>

        {/* Main Central Card */}
        <div className="relative mx-auto my-auto w-full max-w-[500px] py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[32px] border border-[#EDE4D8] bg-white p-7 sm:p-9 shadow-[0_20px_50px_-20px_rgba(28,25,23,0.18)]"
          >
            {eyebrow && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono uppercase tracking-wider font-semibold bg-[#F4ECE3] text-teal-900 border border-[#E5DACD] mb-3">
                <CheckCircle2 className="size-3 text-teal-700" />
                {eyebrow}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                {description}
              </p>
            )}

            <div className="mt-6">{children}</div>
          </motion.div>

          {footer && <div className="mt-5 text-center text-xs text-stone-600">{footer}</div>}
          {below && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mt-6">
              {below}
            </motion.div>
          )}
        </div>

        {/* Bottom Disclaimer */}
        <p className="relative text-center text-[11px] text-stone-500 pt-4">
          Synthetic healthcare demo environment. All patient profiles are fictional.
        </p>
      </main>
    </div>
  );
}
