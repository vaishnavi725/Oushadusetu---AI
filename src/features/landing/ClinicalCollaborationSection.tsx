import { motion } from 'motion/react';
import {
  Clock,
  Zap,
  ShieldCheck,
  TrendingDown,
  Users,
} from 'lucide-react';
import { WordByWord } from './WordByWord';
import { AnimatedNumber } from '@/components/pharma';

const METRICS = [
  {
    label: 'Resolution Time',
    num: 4,
    prefix: '< ',
    suffix: ' Hours',
    decimals: 0,
    progress: 88,
    delta: '89% faster than legacy faxes',
    icon: Clock,
  },
  {
    label: 'AI Automation Rate',
    num: 88.4,
    suffix: '%',
    decimals: 1,
    progress: 88.4,
    delta: 'Low-risk cases auto-drafted',
    icon: Zap,
  },
  {
    label: 'Prevented Lapses',
    num: 1420,
    suffix: '+',
    decimals: 0,
    progress: 95,
    delta: 'Zero treatment gaps across cohort',
    icon: ShieldCheck,
  },
  {
    label: 'Escalations Rate',
    num: 1.2,
    prefix: '< ',
    suffix: '%',
    decimals: 1,
    progress: 12,
    delta: 'Down from 18.5% industry baseline',
    icon: TrendingDown,
  },
  {
    label: 'Patient Response Rate',
    num: 96.8,
    suffix: '%',
    decimals: 1,
    progress: 96.8,
    delta: 'Within 2 hours via secure SMS',
    icon: Users,
  },
];

export function ClinicalCollaborationSection() {
  return (
    <section id="analytics" className="py-24 bg-[#FAF6F1] text-slate-900 border-t border-[#EFE7DE] relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200 mb-3">
            Operational Metrics
          </div>

          <WordByWord
            text="Refill Operations, At a Glance."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Operational outcomes measured across connected clinics and pharmacies over 180 days of active refill orchestration.
          </p>
        </div>

        {/* 5 Elegant Metric Panels */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] flex flex-col justify-between hover:border-teal-400 hover:shadow-[0_12px_32px_rgba(20,184,166,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    {metric.label}
                  </span>
                  <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <metric.icon className="size-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                  <AnimatedNumber
                    value={metric.num}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                  />
                </div>

                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-teal-700/80 font-mono leading-relaxed">
                {metric.delta}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
