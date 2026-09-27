import { useState, useEffect } from 'react';
import {
  User,
  Building2,
  Stethoscope,
  CreditCard,
  Brain,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { WordByWord } from './WordByWord';

const FLOW_NODES = [
  {
    id: 'patient',
    label: 'Patient',
    sub: 'Telemetry Ingest',
    icon: User,
    color: 'from-blue-500 to-cyan-400',
    detail: 'Continuous tracking monitors pill count and historical adherence velocity.',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    sub: 'Inventory & Claims',
    icon: Building2,
    color: 'from-cyan-500 to-teal-400',
    detail: 'Automated claim reconciliation and pharmacy dispenser availability check.',
  },
  {
    id: 'provider',
    label: 'Provider',
    sub: 'Clinical Review',
    icon: Stethoscope,
    color: 'from-teal-500 to-emerald-400',
    detail: 'Pre-assembled clinical dossier with lab recency & contraindications.',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    sub: 'Prior Authorization',
    icon: CreditCard,
    color: 'from-indigo-500 to-blue-400',
    detail: 'Electronic formulary check and real-time prior-auth clearance.',
  },
  {
    id: 'ai',
    label: 'OushadhaSetu AI',
    sub: 'Orchestration Engine',
    icon: Brain,
    color: 'from-purple-500 to-teal-400',
    detail: 'Autonomous blocker resolution & next-best-action routing.',
  },
  {
    id: 'resolution',
    label: 'Resolution',
    sub: 'Zero Medication Lapse',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-teal-400',
    detail: 'Order dispensed with patient mobile confirmation.',
  },
];

export function EcosystemFlowSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_NODES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="flow-works" className="py-24 bg-[#0B1726] text-white border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-3">
            Natural Network Flow
          </div>

          <WordByWord
            text="One Refill. One Intelligent Flow."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-100 justify-center text-center"
          />

          <WordByWord
            text="OushadhaSetu keeps every stakeholder connected while continuously identifying what is blocking the next step."
            as="p"
            className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed justify-center text-center max-w-2xl mx-auto"
            delay={0.25}
          />
        </div>

        {/* The Natural Flow Highway */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 relative">
          {FLOW_NODES.map((node, i) => {
            const isCurrent = i === activeStep;
            return (
              <div
                key={node.id}
                onClick={() => setActiveStep(i)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#07111F] border-teal-400/60 shadow-[0_0_25px_rgba(20,184,166,0.18)] scale-[1.02]'
                    : 'bg-[#07111F]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <span className="font-mono text-xs text-slate-500 font-bold">
                      0{i + 1}
                    </span>
                    <span className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded ${
                      isCurrent ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-500'
                    }`}>
                      {isCurrent ? 'In Transit' : 'Synchronized'}
                    </span>
                  </div>

                  <div className="size-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-300 mb-3">
                    <node.icon className="size-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-display">
                    {node.label}
                  </h3>
                  <p className="text-[11px] font-semibold text-teal-400 mt-0.5 font-mono">
                    {node.sub}
                  </p>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {node.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                  <span className={isCurrent ? 'text-teal-300 font-mono font-semibold' : 'text-slate-500 font-mono'}>
                    {isCurrent ? '● Active' : 'Standby'}
                  </span>
                  {i < FLOW_NODES.length - 1 && (
                    <ArrowRight className="size-3 text-slate-600 hidden lg:inline" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
