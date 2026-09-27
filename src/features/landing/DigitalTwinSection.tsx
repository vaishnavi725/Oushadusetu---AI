import { motion } from 'motion/react';
import { Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { WordByWord } from './WordByWord';
import { RefillWorkflowVisual } from '@/components/pharma';

export function DigitalTwinSection() {
  return (
    <section id="digital-twin" className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200 mb-3">
            <Cpu className="size-3.5" />
            Synchronized Virtual State
          </div>

          <WordByWord
            text="See Every Refill’s Digital Twin."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Instead of fragmented paper faxes and blind pharmacy holds, every active prescription exists as a live digital replica across clinic, pharmacy, and patient streams.
          </p>
        </div>

        {/* 7-Stage Refill Progression Pipeline (OushadhaSetu Workflow) */}
        <div className="mt-12 max-w-4xl mx-auto mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-mono uppercase text-teal-800 tracking-wider px-2">
            <span>Synchronized Refill Pipeline</span>
            <span className="text-slate-500">Autonomous Orchestration Stream</span>
          </div>
          <RefillWorkflowVisual mode="ribbon" activeStep="ai" className="shadow-lg border-teal-500/20" />
        </div>

        {/* Large Interactive Digital Twin Card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto rounded-3xl bg-[#FAF6F1] border border-[#EDE4D8] p-6 sm:p-10 shadow-xl"
        >
          {/* Top Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-teal-500/15 text-teal-700 flex items-center justify-center font-bold">
                <Cpu className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-teal-700 uppercase tracking-widest block">
                  REFILL DIGITAL TWIN
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Telemetry Stream · Case #RX-4091 · Metformin 500 mg
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-teal-500" />
              </span>
              <span className="font-mono text-xs text-slate-400">STATE SYNCHRONIZED</span>
            </div>
          </div>

          {/* Sequential Grid Rows: Required Fields */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                  Current Blocker
                </span>
                <div className="mt-1 text-base font-semibold text-rose-700">
                  Provider Approval Required
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono">
                Prescription requires clinical re-authorization (0 refills remaining)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                  Risk Score
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-semibold text-slate-900">
                    89% (HIGH RISK)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-rose-50 text-rose-700 border-rose-200">
                    CRITICAL
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono">
                2 days supply remaining vs 6-day historical patient delay
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                  Resolution Probability
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-semibold text-teal-700">
                    94% High Confidence
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-teal-500/15 text-teal-700 border-teal-500/30">
                    HIGH
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400 font-mono">
                Clean lab recency with no active clinical contraindications
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                  Next Best Action
                </span>
                <div className="mt-1 text-base font-semibold text-sky-800">
                  Request Provider Approval
                </div>
              </div>
              <div className="mt-2 text-xs text-teal-700 font-medium flex items-center gap-1">
                <Sparkles className="size-3" />
                <span>Pre-drafted digital clinical packet waiting for signature</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <span>Last Telemetry Sync: 12 seconds ago</span>
            <span className="text-teal-700 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="size-4" />
              Verified Closed-Loop Twin
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
