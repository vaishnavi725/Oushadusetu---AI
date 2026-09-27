import { motion } from 'motion/react';
import {
  Brain,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  User,
  FileText,
  Building2,
  Stethoscope,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { label: 'Patient', icon: User },
  { label: 'Prescription', icon: FileText },
  { label: 'Pharmacy', icon: Building2 },
  { label: 'Provider', icon: Stethoscope },
  { label: 'Insurance', icon: CreditCard },
  { label: 'AI', icon: Brain, active: true },
  { label: 'Resolution', icon: CheckCircle2, success: true },
];

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[580px] mx-auto lg:max-w-none select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-12 -left-12 size-72 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-8 size-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container holding the Healthcare Image & Workflow */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-2xl p-3 sm:p-4"
      >
        {/* Connected Workflow Ribbon Header */}
        <div className="mb-3 px-2 py-2 rounded-2xl bg-slate-900/90 text-white shadow-inner flex items-center justify-between overflow-x-auto [scrollbar-width:none]">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-medium tracking-wide">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                    step.active
                      ? 'bg-teal-500/30 text-teal-300 ring-1 ring-teal-400 font-semibold shadow-sm'
                      : step.success
                      ? 'bg-emerald-500/30 text-emerald-300 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  <step.icon className="size-3" />
                  <span className="text-[10.5px]">{step.label}</span>
                </span>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ArrowRight className="size-2.5 text-slate-600 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Visual Image Container */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 group shadow-md border border-slate-200/50">
          <img
            src="/images/refill-hero.jpg"
            alt="OushadhaSetu AI Medication Intelligence and Prescription Refill Workflow"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          {/* Subtle gradient vignette to blend with overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Dynamic Image Overlay Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs px-3 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-teal-500" />
              </span>
              <span className="font-semibold text-slate-100">Live Orchestration Stream</span>
            </div>
            <span className="text-[11px] text-teal-300 font-mono">1,420 Active Prescriptions Synced</span>
          </div>
        </div>

        {/* AI Copilot Status Card (Embedded Bottom) */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-teal-50/90 via-white to-blue-50/60 border border-teal-100/90 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="size-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Oushadha AI</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    High Risk
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Continuous refill stream analysis</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Confidence</span>
              <div className="text-xs font-bold text-teal-700">92%</div>
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-teal-100/80 grid grid-cols-2 gap-2 text-[11.5px]">
            <div>
              <span className="text-slate-500 text-[10.5px]">Current State:</span>
              <div className="font-semibold text-slate-800 truncate">Provider Approval Required</div>
            </div>
            <div>
              <span className="text-slate-500 text-[10.5px]">Next Best Action:</span>
              <div className="font-semibold text-teal-800 truncate flex items-center gap-1">
                <span>Request provider approval</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 1: AI REFILL INTELLIGENCE (Top-Right / Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hidden sm:block absolute -top-6 -right-6 lg:-right-10 z-20"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-white/95 backdrop-blur-xl border border-rose-200/80 rounded-2xl p-3.5 shadow-xl w-64 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between text-[10.5px] font-bold tracking-wider text-slate-400 uppercase">
            <span className="flex items-center gap-1.5 text-rose-700">
              <AlertTriangle className="size-3.5 text-rose-600" />
              AI Refill Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              HIGH RISK
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-900 leading-snug">
            Refill gap detected for Atorvastatin 20mg
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Patient: Robert C.</span>
            <span className="font-medium text-rose-600 font-mono">0 refills left</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 2: PROACTIVE LAPSE DETECTION (Bottom-Left / Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 15 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="hidden sm:block absolute -bottom-8 -left-6 lg:-left-10 z-20"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-2xl p-3.5 shadow-xl w-64 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between text-[10.5px] font-bold tracking-wider text-amber-800 uppercase">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber-600" />
              Proactive Lapse Detection
            </span>
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-900">
            4 days supply remaining
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Historical refill lag:</span>
            <span className="font-semibold text-amber-700 font-mono">6 days delay</span>
          </div>
          <div className="mt-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <ShieldCheck className="size-3" />
            <span>Early outreach scheduled</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Card 3: RESOLUTION INTELLIGENCE (Right Side Accent) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute top-1/2 -right-8 -translate-y-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="bg-white/95 backdrop-blur-xl border border-teal-200/80 rounded-2xl p-3 shadow-xl w-56"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
            <CheckCircle2 className="size-3 text-teal-600" />
            Resolution Intelligence
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800">
            Next action identified
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Provider sign-off packet prepared with metabolic lab recency.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
