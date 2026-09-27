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
    <section id="flow-works" className="py-24 bg-[#FAF6F1] text-slate-900 border-t border-[#EFE7DE] relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200 mb-3">
            Natural Network Flow
          </div>

          <WordByWord
            text="One Refill. One Intelligent Flow."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-900 justify-center text-center"
          />

          <WordByWord
            text="OushadhaSetu keeps every stakeholder connected while continuously identifying what is blocking the next step."
            as="p"
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed justify-center text-center max-w-2xl mx-auto"
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
                    ? 'bg-white border-teal-600 shadow-[0_18px_40px_-28px_rgba(15,118,110,0.55)] scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="font-mono text-xs text-slate-500 font-bold">
                      0{i + 1}
                    </span>
                    <span className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded ${
                      isCurrent ? 'bg-teal-500/20 text-teal-700 font-bold' : 'text-slate-500'
                    }`}>
                      {isCurrent ? 'In Transit' : 'Synchronized'}
                    </span>
                  </div>

                  <div className="size-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-teal-700 mb-3">
                    <node.icon className="size-5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {node.label}
                  </h3>
                  <p className="text-[11px] font-semibold text-teal-700 mt-0.5 font-mono">
                    {node.sub}
                  </p>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {node.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className={isCurrent ? 'text-teal-700 font-mono font-semibold' : 'text-slate-500 font-mono'}>
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

        {/* Every Refill Becomes a Live Digital Twin Parameters */}
        <div className="mt-20 pt-16 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-teal-700 block mb-2">
              Continuous Virtual Representation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Every Refill Becomes a Synchronized Digital Twin
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Eight real-time operational parameters continuously calculated for every active prescription in the network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Current State', val: 'Provider Approval Required', desc: 'Real-time synchronization across clinic EHR and pharmacy systems.' },
              { label: 'Root Cause', val: 'Authorization Exhausted', desc: 'Zero authorized refills remaining on current prescription order.' },
              { label: 'Responsible Party', val: 'Dr. Rao (Prescriber)', desc: 'Directly routes clinical dossier to the authorized prescriber.' },
              { label: 'Next Action', val: 'Request Provider Approval', desc: 'Pre-drafted digital clinical packet waiting for one-click signature.' },
              { label: 'Deadline', val: '24 Hours Before Empty', desc: 'Calculated from historical consumption and days-supply telemetry.' },
              { label: 'Outcome', val: 'Zero Treatment Disruption', desc: 'Verified medication dispensed before final dose runout.' },
              { label: 'Risk Score', val: '89% Discontinuation Risk', desc: 'Computed from historical lag velocity and medication criticality.' },
              { label: 'Resolution Probability', val: '94% Automated First-Pass', desc: 'Predicted probability of same-day clinical authorization.' },
            ].map((p, idx) => (
              <div
                key={p.label}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Parameter 0{idx + 1}
                    </span>
                    <span className="size-1.5 rounded-full bg-teal-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    {p.label}
                  </h4>
                  <div className="mt-1 text-xs font-semibold text-teal-700 font-mono">
                    {p.val}
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-2.5">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
