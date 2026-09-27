import { motion } from 'motion/react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function KeyDifferentiator() {
  return (
    <section id="platform" className="relative py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] border-y border-slate-200/60 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 size-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Core Highlighted Statement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F766E] text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle geometric lines */}
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-teal-500/20 blur-2xl" />
          <div className="absolute -left-16 -bottom-16 size-64 rounded-full bg-blue-500/20 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30 mb-5">
              <Sparkles className="size-3.5" />
              Paradigm Shift in Medication Adherence
            </span>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight max-w-3xl">
              &ldquo;Don&apos;t wait for the refill to fail. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-200 to-teal-100 bg-clip-text text-transparent">
                Prevent the lapse before it happens.
              </span>&rdquo;
            </h3>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Traditional healthcare waits for empty bottles and frantic pharmacy calls. OushadhaSetu continuously monitors refill trajectories, predicting gaps up to 14 days in advance.
            </p>
          </div>
        </motion.div>

        {/* Side-by-Side Reactive vs. Proactive Matrix */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Old Traditional Reactive Model */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl p-6 sm:p-8 bg-white border border-rose-100 shadow-sm relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Traditional Legacy Workflow</span>
                  <h4 className="text-xl font-bold text-slate-800 mt-1">Reactive Refill Processing</h4>
                </div>
                <div className="size-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertCircle className="size-6" />
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <span>Core Flaw:</span>
                <span className="font-normal text-rose-700">Refill systems wait for patient or pharmacy request after pills run out.</span>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <TrendingDown className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Silent Treatment Lapses:</strong> Patients omit doses for 4 to 8 days while waiting for clinic call-backs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Fragmented Communications:</strong> Disconnected faxes, voicemails, and unread portal notes between clinic &amp; pharmacy.</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Staff Burnout:</strong> Nurses spend 2.5 hours daily chasing refill authorizations and lab dependencies.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Avg. Resolution Latency</span>
              <span className="font-bold text-rose-600 font-mono text-sm">4.8 Days Delay</span>
            </div>
          </motion.div>

          {/* OushadhaSetu AI Proactive Model */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/40 border-2 border-teal-500/50 shadow-xl relative flex flex-col justify-between"
          >
            {/* Top Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-xs font-bold bg-teal-600 text-white shadow-md flex items-center gap-1.5">
              <Zap className="size-3.5 fill-current" />
              <span>OushadhaSetu AI Standard</span>
            </div>

            <div>
              <div className="flex items-center justify-between pb-5 border-b border-teal-100">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Intelligent Orchestration</span>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">Proactive Lapse Prevention</h4>
                </div>
                <div className="size-11 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="size-6" />
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-teal-100/50 border border-teal-200 text-xs font-semibold text-teal-900 flex items-center gap-2">
                <span>The Advantage:</span>
                <span className="font-normal text-teal-800">Detects risk and prepares provider approval packets days before run-out.</span>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Zero-Friction Adherence:</strong> Proactive identification of 0-refill maintenance meds with historical adherence scoring.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>One Shared Case:</strong> Unifies patient, pharmacy, clinician, and insurer into a single synchronized state machine.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Single-Click Clinical Actions:</strong> Pre-validated lab dates, contraindication scans, and pre-composed authorization packets.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-teal-100 flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Avg. Resolution Latency</span>
              <span className="font-bold text-teal-700 font-mono text-sm">&lt; 4 Hours Orchestrated</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
