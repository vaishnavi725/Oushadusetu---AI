import { useState, useEffect } from 'react';
import {
  FileText,
  ShieldAlert,
  Brain,
  MessageSquare,
  AlertOctagon,
  FileCheck2,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { WordByWord } from './WordByWord';

const AGENTS = [
  {
    name: 'INTAKE AGENT',
    role: 'Channel Normalization',
    icon: FileText,
    desc: 'Extracts structured medication requests from portal notes, e-prescribe feeds, and phone audio.',
  },
  {
    name: 'RISK AGENT',
    role: 'Clinical Safety Scrutiny',
    icon: ShieldAlert,
    desc: 'Runs automated checks on patient adherence lag, organ clearance metrics, and lab recency.',
  },
  {
    name: 'RESOLUTION AGENT',
    role: 'Next Best Action',
    icon: Brain,
    desc: 'Calculates the optimal clinical resolution and drafts digital authorization packets for the prescriber.',
  },
  {
    name: 'COMMUNICATION AGENT',
    role: 'Multi-Stakeholder Sync',
    icon: MessageSquare,
    desc: 'Sends automated SMS updates to patients and bi-directional NCPDP notices to community pharmacies.',
  },
  {
    name: 'ESCALATION AGENT',
    role: 'SLA Guardrail',
    icon: AlertOctagon,
    desc: 'Flags stranded cases approaching clinical deadline directly to supervisor queues.',
  },
  {
    name: 'AUDIT AGENT',
    role: 'Cryptographic Ledger',
    icon: FileCheck2,
    desc: 'Logs every rationale, timestamp, and human approval in an immutable audit trail for full HIPAA governance.',
  },
];

export function ConnectedAiAgentsSection() {
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % AGENTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="ai-agents" className="py-24 bg-[#07111F] text-white border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-3">
            <Cpu className="size-3.5" />
            Autonomous Orchestration
          </div>

          <WordByWord
            text="An AI Team Working Behind Every Refill."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-100 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Six specialized agents operate sequentially under strict clinical protocols, providing transparent decision support at every stage.
          </p>
        </div>

        {/* 6 Connected Nodes Grid with Single-Active Focus */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {AGENTS.map((agent, idx) => {
            const isActive = idx === activeAgent;
            return (
              <div
                key={agent.name}
                onClick={() => setActiveAgent(idx)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0B1726] border-teal-400/60 shadow-[0_0_30px_rgba(20,184,166,0.18)] scale-[1.02]'
                    : 'bg-[#0B1726]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${isActive ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        AGENT-0{idx + 1}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? 'text-teal-300 font-bold' : 'text-slate-500'}`}>
                      {isActive ? '● Active Task' : 'Standby'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3.5">
                    <div className={`size-11 rounded-xl flex items-center justify-center border ${
                      isActive ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-white/5 text-slate-400 border-white/5'
                    }`}>
                      <agent.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 font-display">
                        {agent.name}
                      </h3>
                      <p className="text-xs font-semibold text-teal-400 mt-0.5 font-mono">
                        {agent.role}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {agent.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Protocol Active</span>
                  {idx < AGENTS.length - 1 ? (
                    <span className="flex items-center gap-1 text-slate-400">
                      <span>Flows to Next</span>
                      <ArrowRight className="size-3" />
                    </span>
                  ) : (
                    <span className="text-teal-300 font-semibold">Closed Loop ✓</span>
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
