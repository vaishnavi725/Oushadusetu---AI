import { motion } from 'motion/react';
import {
  Clock,
  TrendingDown,
  AlertTriangle,
  Brain,
  MessageSquare,
  CheckCircle2,
  ArrowDown,
  Zap,
} from 'lucide-react';
import { WordByWord } from './WordByWord';

const PROGRESSION = [
  {
    stage: '01',
    label: '4 DAYS LEFT',
    icon: Clock,
    sub: '4 pills remaining in patient bottle (Metformin 500 mg).',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    stage: '02',
    label: 'Historical Refill Lag: 6 DAYS',
    icon: TrendingDown,
    sub: 'Claims analysis shows patient waits 6 days post-runout before asking clinic.',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
  {
    stage: '03',
    label: 'No Refill Request Detected',
    icon: AlertTriangle,
    sub: 'Zero inbound portal messages, faxes, or calls logged across channels.',
    color: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  },
  {
    stage: '04',
    label: 'AI Detects Silent-Lapse Risk',
    icon: Brain,
    sub: 'Oushadha Risk Engine flags 89% probability of treatment discontinuation.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    stage: '05',
    label: 'Proactive Outreach Recommended',
    icon: MessageSquare,
    sub: 'Pre-assembled clinical re-authorization packet pushed to Dr. Rao.',
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  },
  {
    stage: '06',
    label: 'Lapse Prevented ✓',
    icon: CheckCircle2,
    sub: 'Prescription renewed & ready at pharmacy 24 hours BEFORE final dose.',
    color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/50',
    highlight: true,
  },
];

export function SilentLapseSection() {
  return (
    <section id="silent-lapse" className="py-24 bg-[#0B1726] text-white border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-3">
            <Zap className="size-3.5" />
            Predictive Intervention
          </div>

          <WordByWord
            text="Don't Wait for the Refill Request."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-100 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Traditional health systems wait for patients to run out and panic. OushadhaSetu tracks refill lag trajectories and acts before the gap occurs.
          </p>
        </div>

        {/* Natural Vertical Progression Pipeline */}
        <div className="mt-16 max-w-2xl mx-auto space-y-4">
          {PROGRESSION.map((step, idx) => (
            <div key={step.stage}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  step.highlight
                    ? 'bg-[#07111F] border-emerald-500/60 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
                    : 'bg-[#07111F]/80 border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`size-11 rounded-xl flex items-center justify-center border ${step.color} shrink-0`}>
                    <step.icon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        STEP {step.stage}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100">
                        {step.label}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {step.sub}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[11px] text-slate-500 shrink-0 hidden sm:inline">
                  {idx < 3 ? 'TELEMETRY' : idx < 5 ? 'AGENT ENGINE' : 'OUTCOME'}
                </span>
              </motion.div>

              {idx < PROGRESSION.length - 1 && (
                <div className="flex justify-center my-1.5">
                  <ArrowDown className="size-4 text-teal-500/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
