import { motion } from 'motion/react';
import { Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { WordByWord } from './WordByWord';

const TWIN_DETAILS = [
  { label: 'Medication', value: 'Metformin 500 mg', sub: 'Oral Tablet · Twice Daily with Meals' },
  { label: 'Current State', value: 'Provider Approval Required', alert: true },
  { label: 'Risk Tier', value: 'HIGH', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  { label: 'Days Remaining', value: '2 Days Supply', sub: 'Historical fill lag: 6 days' },
  { label: 'Next Action', value: 'Request Provider Approval', action: true },
  { label: 'Confidence Score', value: '92%', sub: 'Backed by 14 historical adherence events' },
];

export function DigitalTwinSection() {
  return (
    <section id="digital-twin" className="py-24 bg-[#07111F] text-white border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-3">
            <Cpu className="size-3.5" />
            Synchronized Virtual State
          </div>

          <WordByWord
            text="Every Refill Has a Digital Twin."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-100 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Instead of fragmented paper faxes and blind pharmacy holds, every active prescription exists as a live digital replica across clinic, pharmacy, and patient streams.
          </p>
        </div>

        {/* Large Interactive Digital Twin Card */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 max-w-3xl mx-auto rounded-3xl bg-[#0B1726] border border-white/10 p-6 sm:p-10 shadow-2xl"
        >
          {/* Top Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-teal-500/15 text-teal-300 flex items-center justify-center font-bold">
                <Cpu className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block">
                  REFILL DIGITAL TWIN
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  Telemetry Stream · Case #RX-4091
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

          {/* Sequential Grid Rows */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TWIN_DETAILS.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-4 rounded-2xl bg-[#07111F]/80 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                    {item.label}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-100">
                      {item.value}
                    </span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${item.badge}`}>
                        HIGH
                      </span>
                    )}
                  </div>
                </div>

                {item.sub && (
                  <div className="mt-2 text-xs text-slate-400 font-mono">
                    {item.sub}
                  </div>
                )}

                {item.action && (
                  <div className="mt-2 text-xs text-teal-400 font-medium flex items-center gap-1">
                    <Sparkles className="size-3" />
                    <span>Auto-drafted clinical signature packet</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <span>Last Telemetry Sync: 12 seconds ago</span>
            <span className="text-teal-400 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="size-4" />
              Verified Closed-Loop Twin
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
