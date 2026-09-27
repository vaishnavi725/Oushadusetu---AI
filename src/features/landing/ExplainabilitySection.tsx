import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Sliders, Sparkles, Brain } from 'lucide-react';
import { WordByWord } from './WordByWord';

export function ExplainabilitySection() {
  const [decisionState, setDecisionState] = useState<'idle' | 'approved' | 'rejected' | 'overridden'>('idle');

  return (
    <section className="py-24 bg-[#FAF6F1] text-slate-900 border-t border-[#EFE7DE] relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200 mb-3">
            <Brain className="size-3.5" />
            Human-in-the-Loop Governance
          </div>

          <WordByWord
            text="Every AI Decision Has a Reason."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            OushadhaSetu never executes autonomous prescription changes behind closed doors. Every recommended action is backed by explicit clinical evidence, transparent rationale, and licensed human approval.
          </p>
        </div>

        {/* Real Product Explainability Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-teal-500/15 text-teal-700 flex items-center justify-center font-bold">
                <Sparkles className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-teal-700 uppercase tracking-widest block">
                  DECISION EXPLAINABILITY AUDIT
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Case RF-9021 · Atorvastatin 20 mg
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Confidence:</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-teal-50 text-teal-800 border border-teal-200">
                94% Confirmed
              </span>
            </div>
          </div>

          {/* Rationale & Evidence */}
          <div className="py-6 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                WHY
              </span>
              <p className="text-base font-semibold text-slate-900">
                Provider approval is required.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
                EVIDENCE
              </span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="size-5 rounded-full bg-teal-500/20 text-teal-700 flex items-center justify-center shrink-0">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                  <span>Prescription requires authorization before refill.</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="size-5 rounded-full bg-teal-500/20 text-teal-700 flex items-center justify-center shrink-0">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                  <span>Patient has limited supply: 2 days remaining based on pharmacy fill velocity.</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="size-5 rounded-full bg-teal-500/20 text-teal-700 flex items-center justify-center shrink-0">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                  <span>Provider review required per practice protocol (Lipid panel recorded 5 months ago).</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-teal-700 block">
                  RECOMMENDED ACTION
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  Request provider approval.
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 shrink-0">
                SLA: 24 Hours
              </span>
            </div>
          </div>

          {/* Interactive Human Buttons */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono">
              {decisionState === 'idle' && 'Human sign-off required — clinical team remains in full control.'}
              {decisionState === 'approved' && '✓ Approved by clinician. Forwarded to pharmacy.'}
              {decisionState === 'rejected' && 'Action rejected. Escalated to clinic head.'}
              {decisionState === 'overridden' && 'Manual override mode engaged.'}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDecisionState('approved')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  decisionState === 'approved'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-teal-700 text-white shadow-sm hover:bg-teal-800'
                }`}
              >
                <Check className="size-3.5 stroke-[3]" />
                <span>Approve</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisionState('rejected')}
                className={`px-4 py-2.5 rounded-full text-xs font-medium transition border ${
                  decisionState === 'rejected'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <X className="size-3.5 inline mr-1" />
                Reject
              </button>

              <button
                type="button"
                onClick={() => setDecisionState('overridden')}
                className={`px-4 py-2.5 rounded-full text-xs font-medium transition border ${
                  decisionState === 'overridden'
                    ? 'bg-sky-50 border-sky-300 text-sky-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sliders className="size-3.5 inline mr-1" />
                Override
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
