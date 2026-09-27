import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/format';

export type PillLoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface PillLoaderProps {
  size?: PillLoaderSize;
  label?: string | ReactNode;
  sublabel?: string | ReactNode;
  variant?: 'teal-amber' | 'cyan-purple' | 'emerald-gold';
  className?: string;
  showShadow?: boolean;
  showRings?: boolean;
}

const sizeConfig: Record<
  PillLoaderSize,
  {
    width: number;
    height: number;
    svgW: string;
    svgH: string;
    shadowW: string;
    textClass: string;
    subtextClass: string;
    gap: string;
  }
> = {
  xs: {
    width: 22,
    height: 11,
    svgW: 'w-[22px]',
    svgH: 'h-[11px]',
    shadowW: 'w-4 h-1',
    textClass: 'text-[11px]',
    subtextClass: 'text-[10px]',
    gap: 'gap-1.5',
  },
  sm: {
    width: 32,
    height: 16,
    svgW: 'w-8',
    svgH: 'h-4',
    shadowW: 'w-6 h-1.5',
    textClass: 'text-xs',
    subtextClass: 'text-[11px]',
    gap: 'gap-2',
  },
  md: {
    width: 52,
    height: 26,
    svgW: 'w-13',
    svgH: 'h-6.5',
    shadowW: 'w-10 h-2',
    textClass: 'text-sm font-semibold',
    subtextClass: 'text-xs',
    gap: 'gap-3',
  },
  lg: {
    width: 76,
    height: 38,
    svgW: 'w-[76px]',
    svgH: 'h-[38px]',
    shadowW: 'w-14 h-2.5',
    textClass: 'text-base font-semibold',
    subtextClass: 'text-xs',
    gap: 'gap-4',
  },
  xl: {
    width: 104,
    height: 52,
    svgW: 'w-[104px]',
    svgH: 'h-[52px]',
    shadowW: 'w-20 h-3',
    textClass: 'text-lg font-bold',
    subtextClass: 'text-sm',
    gap: 'gap-5',
  },
  '2xl': {
    width: 140,
    height: 70,
    svgW: 'w-[130px] sm:w-[150px]',
    svgH: 'h-[65px] sm:h-[75px]',
    shadowW: 'w-24 sm:w-28 h-3.5',
    textClass: 'text-xl font-bold',
    subtextClass: 'text-sm',
    gap: 'gap-6',
  },
};

export function PillLoader({
  size = 'md',
  label,
  sublabel,
  variant = 'teal-amber',
  className,
  showShadow = true,
  showRings = false,
}: PillLoaderProps) {
  const cfg = sizeConfig[size];
  const isLarge = size === 'lg' || size === 'xl' || size === '2xl';

  // Variant gradient definitions
  const gradients = {
    'teal-amber': {
      left1: '#0f766e',
      left2: '#14b8a6',
      right1: '#f59e0b',
      right2: '#fb923c',
      glow: 'from-teal-500/25 via-amber-400/20 to-teal-600/20',
      ringColor: '#14b8a6',
    },
    'cyan-purple': {
      left1: '#0284c7',
      left2: '#38bdf8',
      right1: '#8b5cf6',
      right2: '#c084fc',
      glow: 'from-sky-500/25 via-violet-400/20 to-sky-600/20',
      ringColor: '#38bdf8',
    },
    'emerald-gold': {
      left1: '#059669',
      left2: '#10b981',
      right1: '#eab308',
      right2: '#fde047',
      glow: 'from-emerald-500/25 via-yellow-400/20 to-emerald-600/20',
      ringColor: '#10b981',
    },
  }[variant];

  return (
    <div
      role="status"
      aria-label={typeof label === 'string' ? label : 'Loading...'}
      className={cn('flex flex-col items-center justify-center select-none', cfg.gap, className)}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Ambient Halo Glow */}
        {isLarge && (
          <motion.div
            animate={{
              scale: [0.95, 1.15, 0.95],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'pointer-events-none absolute -inset-3 rounded-full blur-xl bg-gradient-to-r',
              gradients.glow,
            )}
            aria-hidden
          />
        )}

        {/* Orbiting Telemetry Rings (Optional for large/hero) */}
        {(showRings || isLarge) && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute -inset-4 rounded-full border border-dashed border-teal-500/20"
            aria-hidden
          />
        )}

        {/* The Animated Floating Tumbling Pill */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotateZ: [-12, 12, -12],
            rotateX: [0, 15, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 46"
            className={cn(cfg.svgW, cfg.svgH, 'overflow-visible drop-shadow-[0_4px_12px_rgba(15,118,110,0.25)]')}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Left Cap Gradient (Teal) */}
              <linearGradient id={`pillLeft-${variant}`} x1="4" y1="4" x2="50" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={gradients.left2} />
                <stop offset="100%" stopColor={gradients.left1} />
              </linearGradient>

              {/* Right Cap Gradient (Amber) */}
              <linearGradient id={`pillRight-${variant}`} x1="50" y1="4" x2="96" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={gradients.right2} />
                <stop offset="100%" stopColor={gradients.right1} />
              </linearGradient>

              {/* Top Glass Specular Shine */}
              <linearGradient id="pillGloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Clip path for capsule contour */}
              <clipPath id="capsuleClip">
                <rect x="4" y="5" width="92" height="36" rx="18" ry="18" />
              </clipPath>
            </defs>

            {/* Pill Base Shadow Outline */}
            <rect x="4" y="5" width="92" height="36" rx="18" ry="18" fill="#0f172a" fillOpacity="0.08" />

            {/* Capsule Body clipped to pill curvature */}
            <g clipPath="url(#capsuleClip)">
              {/* Left Half (Clinical Teal) */}
              <rect x="4" y="5" width="46" height="36" fill={`url(#pillLeft-${variant})`} />

              {/* Right Half (Amber Warm Coral) */}
              <rect x="50" y="5" width="46" height="36" fill={`url(#pillRight-${variant})`} />

              {/* Seam Line between halves */}
              <line x1="50" y1="5" x2="50" y2="41" stroke="#0f172a" strokeOpacity="0.2" strokeWidth="1.2" />
              <line x1="50.8" y1="5" x2="50.8" y2="41" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.8" />

              {/* Top Glass Reflection Bar */}
              <path
                d="M 12 11 Q 50 8 88 11 Q 50 14 12 11 Z"
                fill="url(#pillGloss)"
              />

              {/* Highlight Specks */}
              <ellipse cx="16" cy="14" rx="3.5" ry="1.5" fill="#ffffff" fillOpacity="0.7" />
              <ellipse cx="84" cy="14" rx="3.5" ry="1.5" fill="#ffffff" fillOpacity="0.7" />

              {/* Bottom Depth Shadow within capsule */}
              <path
                d="M 10 33 Q 50 38 90 33 Q 50 41 10 33 Z"
                fill="#000000"
                fillOpacity="0.18"
              />
            </g>

            {/* Crisp Capsule Outer Stroke */}
            <rect
              x="4"
              y="5"
              width="92"
              height="36"
              rx="18"
              ry="18"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
          </svg>
        </motion.div>

        {/* Dynamic Elliptical Dropped Shadow */}
        {showShadow && (
          <motion.div
            animate={{
              scale: [0.8, 1.15, 0.8],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              cfg.shadowW,
              'mt-1.5 rounded-full bg-slate-900/40 blur-[2.5px] pointer-events-none',
            )}
            aria-hidden
          />
        )}
      </div>

      {/* Optional Animated Telemetry Label */}
      {(label || sublabel) && (
        <div className="flex flex-col items-center text-center">
          {label && (
            <motion.p
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(cfg.textClass, 'text-slate-900 tracking-tight')}
            >
              {label}
            </motion.p>
          )}
          {sublabel && (
            <p className={cn(cfg.subtextClass, 'mt-0.5 text-stone-500 font-mono tracking-wide')}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Micro Pill Spinner for Buttons & Badges (Drop-in replacement for lucide Loader2)
 */
export function PillSpinner({ className, size = 'sm' }: { className?: string; size?: 'xs' | 'sm' }) {
  return (
    <span className={cn('inline-flex items-center justify-center shrink-0', className)} role="status" aria-label="Loading">
      <PillLoader size={size} showShadow={false} />
    </span>
  );
}

/**
 * Curated facts about the OushadhaSetu AI project
 */
export const PROJECT_FACTS = [
  {
    tag: 'Sanskrit Heritage',
    fact: "The name 'OushadhaSetu' translates from Sanskrit to 'The Medicine Bridge' (Oushadha = Medicine, Setu = Bridge) — bridging clinics, pharmacies, and patients.",
  },
  {
    tag: 'Refill Speedup',
    fact: 'OushadhaSetu collapses 72-hour prescription bottlenecks down to seconds using autonomous, multi-agent AI verification.',
  },
  {
    tag: '5 Specialized AI Agents',
    fact: 'Triage, Policy, Pharmacy Router, Safety Auditor, and Communicator agents operate in tandem to resolve medication blockers.',
  },
  {
    tag: 'Physician Authority',
    fact: 'Every critical clinical override requires cryptographic AAL2 multi-factor authorization, keeping doctors firmly in command.',
  },
  {
    tag: 'Silent-Lapse Detection',
    fact: 'Autonomous digital twins track medication refill cycles to proactively detect non-adherence before chronic prescriptions expire.',
  },
  {
    tag: 'Deterministic State Machine',
    fact: 'Guarantees 100% protocol adherence through rigorous state machine transitions, eliminating hallucination risk in healthcare.',
  },
  {
    tag: 'Zero Phone Tag',
    fact: 'Direct telemetry conduits eliminate hours spent on pharmacy phone hold queues and unreturned provider voicemails.',
  },
  {
    tag: 'EHR Interoperability',
    fact: 'Engineered for seamless bi-directional integration with HL7 FHIR-compliant Electronic Health Record platforms.',
  },
  {
    tag: '4-Tier Hierarchy',
    fact: 'Operates on a 4-tier safety model: Ingest Telemetry → Deterministic State Machine → Multi-Agent AI → Human Authority.',
  },
  {
    tag: 'Clinical Audit Trail',
    fact: 'Every prescription decision, dosage check, and agent recommendation is recorded in an immutable, tamper-evident audit ledger.',
  },
];

/**
 * Animated random project fact badge with smooth transitions
 */
export function ProjectFactCard({ className }: { className?: string }) {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * PROJECT_FACTS.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => {
        let next = Math.floor(Math.random() * PROJECT_FACTS.length);
        if (next === prev) next = (prev + 1) % PROJECT_FACTS.length;
        return next;
      });
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const current = PROJECT_FACTS[factIndex];

  return (
    <div className={cn('mt-6 max-w-md w-full px-4 flex flex-col items-center select-none', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={factIndex}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative flex flex-col items-center rounded-2xl border border-white/15 bg-slate-900/90 px-6 py-4 text-center shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          {/* Subtle top pill badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-0.5 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-teal-300">
            <Sparkles className="size-3 text-teal-400 animate-pulse" />
            <span>Project Insight · {current.tag}</span>
          </div>

          {/* Fact content */}
          <p className="mt-2.5 text-[12.5px] sm:text-[13px] font-medium text-slate-100 leading-relaxed max-w-sm">
            "{current.fact}"
          </p>

          {/* Clinical indicator footer */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>OushadhaSetu Clinical AI Engine</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Centered Pill Loading Screen with animated project facts
 */
export function PillLoadingScreen({
  className,
  fullScreen = true,
  showFact = true,
}: {
  className?: string;
  fullScreen?: boolean;
  showFact?: boolean;
}) {
  return (
    <div
      className={cn(
        fullScreen
          ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none'
          : 'flex min-h-[60vh] w-full flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none',
        className,
      )}
      role="status"
      aria-label="Loading..."
    >
      <div className="flex flex-col items-center justify-center">
        <PillLoader size="2xl" showRings />
        {showFact && <ProjectFactCard />}
      </div>
    </div>
  );
}
