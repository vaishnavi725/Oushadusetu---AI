import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Brain, GitCommit, Database, ArrowRight, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { WordByWord } from './WordByWord';

const PYRAMID_LAYERS = [
  {
    level: 4,
    tier: 'Apex Layer',
    title: 'Licensed Human Authority',
    subtitle: 'Zero Unapproved Clinical Actions',
    color: 'from-amber-500 via-teal-500 to-emerald-400',
    borderColor: 'border-amber-400/50',
    bgBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: ShieldCheck,
    description: 'No refill order, dose adjustment, or fulfillment approval is ever finalized without biometric/MFA verification by a licensed MD, DO, NP, or PharmD.',
    stats: '100% Clinician Verified',
    guarantees: [
      'Step-up AAL2 multi-factor authorization',
      'Immutable cryptographic sign-off',
      'Zero blind automated dispensing',
    ],
    image: '/images/clinical-team.jpg',
    imageCaption: 'Multidisciplinary clinical review team verifying digital twin orders.',
  },
  {
    level: 3,
    tier: 'Tier 3',
    title: 'Autonomous Multi-Agent AI',
    subtitle: 'Intelligent Investigation & Copilot',
    color: 'from-teal-600 via-cyan-600 to-sky-500',
    borderColor: 'border-teal-400/50',
    bgBadge: 'bg-teal-100 text-teal-900 border-teal-300',
    icon: Brain,
    description: 'Six coordinated clinical AI agents operate in strict sequence: extracting messy faxes, summarizing chart recency, evaluating formulary prior auth, and drafting patient text notifications.',
    stats: '88.4% Auto-Triage Rate',
    guarantees: [
      'Intake, Triage, Risk, Resolution, Comms & Audit agents',
      'Explainable evidence citations with rule-backed rationale',
      'Safe fallback to human review on any uncertainty',
    ],
    image: '/images/refill-hero.jpg',
    imageCaption: 'Real-time telemetry and medication intelligence portal.',
  },
  {
    level: 2,
    tier: 'Tier 2',
    title: 'Deterministic State Machine',
    subtitle: 'Strict Transitions (T1–T27) & Rules (R1–R10)',
    color: 'from-sky-700 via-indigo-700 to-slate-800',
    borderColor: 'border-sky-400/40',
    bgBadge: 'bg-sky-100 text-sky-900 border-sky-300',
    icon: GitCommit,
    description: 'Every prescription follows mathematically provable finite-state pathways. If a lab is overdue (R2) or an annual visit is missing (R1), the blocker is immediately diagnosed with a single named owner.',
    stats: '27 Strict State Transitions',
    guarantees: [
      'Deterministic rule engine without stochastic hallucinations',
      'Automated SLA monitoring and proactive risk escalation',
      'Enforced role-based access control (RBAC)',
    ],
    image: '/images/capsule-hero.png',
    imageCaption: 'Digital Twin simulation of active capsule fulfillment.',
  },
  {
    level: 1,
    tier: 'Foundation Base',
    title: 'Ecosystem Telemetry & Ingest',
    subtitle: 'Unified Clinic, Pharmacy & Patient Stream',
    color: 'from-slate-900 via-slate-800 to-teal-950',
    borderColor: 'border-slate-600/50',
    bgBadge: 'bg-slate-100 text-slate-900 border-slate-300',
    icon: Database,
    description: 'Continuous ingest connects pharmacy outbox retries, EHR HL7/FHIR bridges, e-prescribing networks, and tokenized SMS status pages into one synchronized living case record.',
    stats: '0 Gaps / Continuous Sync',
    guarantees: [
      'Zero patient login wall via secure tokenized links',
      'Outbox worker with exponential backoff & dead-letter queue',
      'Full FHIR R4 compatibility and HIPAA encryption at rest',
    ],
    image: '/images/media1.png',
    imageCaption: 'End-to-end pharmacy and practice dispatch architecture.',
  },
];

export function PyramidSolutionSection() {
  const [activeLevel, setActiveLevel] = useState(4); // Default to apex
  const currentLayer = PYRAMID_LAYERS.find((l) => l.level === activeLevel) || PYRAMID_LAYERS[0];
  const Icon = currentLayer.icon;

  return (
    <section
      id="pyramid-solution"
      className="relative scroll-mt-24 py-28 bg-gradient-to-b from-[#FAF6F0] via-[#F5ECE1] to-[#FAF6F0] text-slate-900 border-t border-[#E8DFD3] overflow-hidden"
    >
      {/* Dynamic Geometric Shape Divider on Top */}
      <div className="pointer-events-none absolute -top-8 inset-x-0 h-16 bg-[#FAF6F0] [clip-path:polygon(0_0,100%_0,50%_100%)] opacity-70" />

      {/* Warm Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-10 h-96 w-96 rounded-full bg-teal-300/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-amber-300/15 blur-3xl" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#EFE3D5] text-teal-950 border border-[#DFCFC0] mb-4">
            <Layers className="size-3.5 text-teal-800" />
            The Resolution Architecture
          </div>

          <WordByWord
            text="The 4-Tier Refill Hierarchy."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-950 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            How OushadhaSetu eliminates medication lapses. Grounded in continuous telemetry at the base, governed by deterministic rules, accelerated by AI agents, and capped by licensed human clinical authority at the apex.
          </p>
        </div>

        {/* The Interactive Pyramid Visual & Detailed Stage */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Visual Pyramid (col-span-6) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <p className="text-xs font-mono uppercase tracking-widest text-teal-900 mb-6 font-semibold">
              Click a tier to explore architectural guarantees:
            </p>

            <div className="w-full max-w-[500px] flex flex-col items-center gap-3">
              {PYRAMID_LAYERS.map((layer) => {
                const isActive = layer.level === activeLevel;
                const LayerIcon = layer.icon;

                // Tapering widths to form a real physical pyramid
                const widthClass =
                  layer.level === 4
                    ? 'w-[52%] sm:w-[48%]'
                    : layer.level === 3
                    ? 'w-[68%] sm:w-[65%]'
                    : layer.level === 2
                    ? 'w-[84%] sm:w-[82%]'
                    : 'w-full';

                return (
                  <motion.button
                    key={layer.level}
                    type="button"
                    onClick={() => setActiveLevel(layer.level)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${widthClass} relative group rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 shadow-md ${
                      isActive
                        ? 'bg-slate-950 text-white ring-2 ring-teal-500 shadow-2xl scale-[1.03]'
                        : 'bg-white/90 text-slate-900 border border-[#E5DACD] hover:bg-white hover:border-teal-400'
                    }`}
                  >
                    {/* Top Tier Accent Bar */}
                    <div
                      className={`absolute top-0 inset-x-6 h-1 rounded-t-full bg-gradient-to-r ${layer.color}`}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-8 rounded-xl flex items-center justify-center ${
                            isActive ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-[#F4ECE3] text-teal-800'
                          }`}
                        >
                          <LayerIcon className="size-4" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-wider block opacity-70">
                            {layer.tier}
                          </span>
                          <span className="font-display text-sm sm:text-base font-bold tracking-tight block">
                            {layer.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white/10 text-teal-300' : 'bg-[#EFE5DB] text-stone-700'
                          }`}
                        >
                          {layer.stats}
                        </span>
                        <ChevronRight
                          className={`size-4 transition-transform duration-200 ${
                            isActive ? 'text-teal-400 rotate-90' : 'text-stone-400 group-hover:translate-x-1'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Tier Deep Dive with Rich Image (col-span-6) */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLayer.level}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-[#E8DFD3] bg-white p-7 sm:p-9 shadow-[0_20px_50px_-20px_rgba(28,25,23,0.18)]"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-3 pb-5 border-b border-[#F0E6DB]">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-teal-800 text-white flex items-center justify-center shadow-md">
                      <Icon className="size-6 text-teal-200" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-teal-800 block">
                        {currentLayer.tier} · {currentLayer.subtitle}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-slate-950">
                        {currentLayer.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${currentLayer.bgBadge}`}>
                    {currentLayer.stats}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-5 text-sm sm:text-base text-stone-600 leading-relaxed">
                  {currentLayer.description}
                </p>

                {/* Real Photographic Clinical Image Integration */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 shadow-sm relative group">
                  <img
                    src={currentLayer.image}
                    alt={currentLayer.title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
                    <p className="text-xs font-medium text-white flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-teal-300 shrink-0" />
                      <span>{currentLayer.imageCaption}</span>
                    </p>
                  </div>
                </div>

                {/* Guarantees Checklist */}
                <div className="mt-6 space-y-2.5">
                  <p className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
                    Key Guarantees:
                  </p>
                  {currentLayer.guarantees.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link */}
                <div className="mt-7 pt-5 border-t border-[#F2E8DC] flex items-center justify-between">
                  <span className="text-xs text-stone-500">Continuous 24/7 autonomous monitoring</span>
                  <a
                    href="#platform"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors"
                  >
                    <span>View interactive cases</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
