import { motion } from 'motion/react';
import {
  Brain,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  Workflow,
  CheckCircle,
  Cpu,
} from 'lucide-react';

const AGENTS = [
  {
    name: 'Intake Agent',
    role: 'Channel & EHR Ingestion',
    icon: FileCheck2,
    color: 'from-blue-600 to-cyan-500',
    capabilities: [
      'Normalizes unstructured patient portal notes & phone transcripts',
      'Matches patient MRN and active medication history against Supabase',
      'Flags duplicate refill requests and conflicting provider orders',
    ],
    status: 'Autonomous Pre-Filter',
  },
  {
    name: 'Clinical Risk Agent',
    role: 'Adherence & Safety Scrutiny',
    icon: ShieldCheck,
    color: 'from-teal-600 to-emerald-500',
    capabilities: [
      'Predicts non-adherence and refill lag using historical patterns',
      'Validates mandatory lab checks (e.g. A1C, BMP, liver enzymes)',
      'Identifies contraindications and drug-drug interactions in real time',
    ],
    status: 'Zero False Negatives',
  },
  {
    name: 'Resolution Agent',
    role: 'Next Best Action Synthesizer',
    icon: Brain,
    color: 'from-indigo-600 to-purple-500',
    capabilities: [
      'Pre-assembles clinical justification for provider digital signature',
      'Generates automated patient guidance and bridge supply requests',
      'Auto-resolves low-risk cases under practice policy thresholds',
    ],
    status: 'Human-in-the-Loop Safe',
  },
  {
    name: 'Pharmacy & Payer Agent',
    role: 'Multi-Stakeholder Delivery',
    icon: Workflow,
    color: 'from-amber-600 to-teal-600',
    capabilities: [
      'Coordinates directly with dispensing retail and mail-order pharmacies',
      'Pre-checks prior-authorization requirements and formulary status',
      'Provides real-time SMS updates directly to patient mobile devices',
    ],
    status: 'Real-time Synchronization',
  },
];

export function AiAgentsSection() {
  return (
    <section id="ai-agents" className="py-24 bg-gradient-to-b from-slate-50 via-teal-50/20 to-white relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-100 text-teal-800 border border-teal-200">
              <Cpu className="size-3.5 text-teal-700" />
              Autonomous Clinical Intelligence
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-display">
              Four Specialized AI Agents. <br className="hidden sm:inline" />
              One Cohesive Healthcare Orchestra.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Rather than a generic chatbot, OushadhaSetu deploys purposeful, deterministically bounded clinical agents designed around strict clinical protocols and auditability.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-teal-200 shadow-sm shrink-0">
            <div className="size-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase">Provider Supervision</div>
              <div className="text-xs text-teal-700 font-semibold">100% Explainable &amp; Auditable</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AGENTS.map((agent, idx) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl p-8 bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className={`size-12 rounded-2xl bg-gradient-to-tr ${agent.color} text-white flex items-center justify-center shadow-md`}>
                      <agent.icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-display">{agent.name}</h3>
                      <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mt-0.5">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 shrink-0">
                    {agent.status}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Protocol Duties:</div>
                  <ul className="space-y-2.5">
                    {agent.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle className="size-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px] text-teal-700">Protocol ID: AGENT-0{idx + 1}-V2</span>
                <span className="font-semibold text-slate-700">Protected by Strict Guardrails</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
