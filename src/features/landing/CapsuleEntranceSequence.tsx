import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserRound,
  FileText,
  Building2,
  Stethoscope,
  ShieldCheck,
  Bot,
  CircleCheck,
  Sparkles,
  ChevronRight,
  Activity,
  Heart,
} from 'lucide-react';

interface CapsuleEntranceSequenceProps {
  onComplete: () => void;
  onSkip?: () => void;
}

// Micro medicine particles inside the capsule
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  floatOffset: number;
}

export type WorkflowPhase =
  | 'appear'
  | 'capsule_open'
  | 'particles_flow'
  | 'patient'
  | 'prescription'
  | 'pharmacy'
  | 'provider_insurance'
  | 'ai_analyzing'
  | 'ai_action'
  | 'resolved'
  | 'zoom_through'
  | 'finished';

export function CapsuleEntranceSequence({ onComplete, onSkip }: CapsuleEntranceSequenceProps) {
  const [phase, setPhase] = useState<WorkflowPhase>('appear');
  const [statusMessage, setStatusMessage] = useState('Initializing Pharmaceutical State Engine...');
  const [progressPct, setProgressPct] = useState(0);

  // Generate realistic pharmaceutical microspheres
  const particles = useRef<Particle[]>(
    Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 110,
      y: Math.random() * 110 - 20,
      size: Math.random() * 4 + 2.5,
      color:
        i % 4 === 0
          ? '#00D9FF' // Cyan glow
          : i % 4 === 1
          ? '#087BFF' // Electric blue
          : i % 4 === 2
          ? '#FFFFFF' // Pure white
          : '#74D7FF', // Soft ice blue
      speed: 0.6 + Math.random() * 0.8,
      floatOffset: Math.random() * Math.PI * 2,
    }))
  ).current;

  // Master timeline orchestration
  useEffect(() => {
    // 1. Capsule appears (0s - 1.2s)
    const t1 = setTimeout(() => {
      setPhase('capsule_open');
      setStatusMessage('Releasing Micro-Seal · Capsule Opening');
      setProgressPct(15);
    }, 1200);

    // 2. Medicine particles flow out (2.8s)
    const t2 = setTimeout(() => {
      setPhase('particles_flow');
      setStatusMessage('Medicine Particles Coalescing into Refill Flow');
      setProgressPct(28);
    }, 2800);

    // 3. Flow reaches Patient node (3.8s)
    const t3 = setTimeout(() => {
      setPhase('patient');
      setStatusMessage('👤 Patient Node Activated · Refill Telemetry Ingested');
      setProgressPct(40);
    }, 3800);

    // 4. Flow reaches Prescription node (4.6s)
    const t4 = setTimeout(() => {
      setPhase('prescription');
      setStatusMessage('💊 Prescription Verified · Dosage & Adherence Velocity Synced');
      setProgressPct(50);
    }, 4600);

    // 5. Flow reaches Pharmacy node (5.4s)
    const t5 = setTimeout(() => {
      setPhase('pharmacy');
      setStatusMessage('🏥 Pharmacy Reconciled · Inventory & Formulary Inquired');
      setProgressPct(60);
    }, 5400);

    // 6. Flow splits to Provider & Insurance (6.2s)
    const t6 = setTimeout(() => {
      setPhase('provider_insurance');
      setStatusMessage('👨‍⚕️ Provider & 🛡️ Insurance Engaged · Clinical Review');
      setProgressPct(72);
    }, 6200);

    // 7. Flow enters OushadhaSetu AI (7.2s)
    const t7 = setTimeout(() => {
      setPhase('ai_analyzing');
      setStatusMessage('🤖 OushadhaSetu AI Analyzing Refill · Root Cause Detection');
      setProgressPct(82);
    }, 7200);

    // 8. AI identifies blocker & determines next action (8.2s)
    const t8 = setTimeout(() => {
      setPhase('ai_action');
      setStatusMessage('⚡ AI Resolution Orchestrated · Blocker Dissolved');
      setProgressPct(90);
    }, 8200);

    // 9. Flow reaches Refill Resolved (9.2s)
    const t9 = setTimeout(() => {
      setPhase('resolved');
      setStatusMessage('✅ Refill Resolved · Continuous Therapy Preserved');
      setProgressPct(98);
    }, 9200);

    // 10. Camera pushes forward through capsule and workflow (10.4s)
    const t10 = setTimeout(() => {
      setPhase('zoom_through');
      setStatusMessage('Entering OushadhaSetu: "Keep Every Refill Moving"');
      setProgressPct(100);
    }, 10400);

    // 11. Finished, handover to Landing Page (11.8s)
    const t11 = setTimeout(() => {
      setPhase('finished');
      onComplete();
    }, 11800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
      clearTimeout(t11);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  if (phase === 'finished') return null;

  const isCapOpen =
    phase !== 'appear';

  const isZooming = phase === 'zoom_through';

  // Step activation flags
  const isPatientActive =
    phase === 'patient' ||
    phase === 'prescription' ||
    phase === 'pharmacy' ||
    phase === 'provider_insurance' ||
    phase === 'ai_analyzing' ||
    phase === 'ai_action' ||
    phase === 'resolved' ||
    phase === 'zoom_through';

  const isPrescriptionActive =
    phase === 'prescription' ||
    phase === 'pharmacy' ||
    phase === 'provider_insurance' ||
    phase === 'ai_analyzing' ||
    phase === 'ai_action' ||
    phase === 'resolved' ||
    phase === 'zoom_through';

  const isPharmacyActive =
    phase === 'pharmacy' ||
    phase === 'provider_insurance' ||
    phase === 'ai_analyzing' ||
    phase === 'ai_action' ||
    phase === 'resolved' ||
    phase === 'zoom_through';

  const isProviderInsuranceActive =
    phase === 'provider_insurance' ||
    phase === 'ai_analyzing' ||
    phase === 'ai_action' ||
    phase === 'resolved' ||
    phase === 'zoom_through';

  const isAiActive =
    phase === 'ai_analyzing' ||
    phase === 'ai_action' ||
    phase === 'resolved' ||
    phase === 'zoom_through';

  const isResolvedActive =
    phase === 'resolved' ||
    phase === 'zoom_through';

  return (
    <AnimatePresence>
      <motion.div
        key="capsule-entrance-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isZooming ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020B18] select-none text-white"
        style={{ perspective: 1200 }}
      >
        {/* Background Deep Space & Medical Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#06245A_0%,_#03132F_45%,_#020B18_100%)]" />

        {/* Ambient Pulsing Cyan Backlight */}
        <motion.div
          animate={{
            scale: isAiActive ? [1.2, 1.5, 1.3] : [1, 1.15, 1],
            opacity: isAiActive ? [0.45, 0.7, 0.5] : [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-[130px]"
        />

        {/* Top Telemetry Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isZooming ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-5 inset-x-0 mx-auto max-w-5xl px-6 flex items-center justify-between z-30"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.3)]">
              <Activity className="size-4 animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-xs font-semibold tracking-widest text-cyan-300 uppercase">
                OushadhaSetu
              </span>
              <span className="block text-[10px] tracking-wider text-slate-400 font-mono">
                AUTONOMOUS REFILL WORKFLOW ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-400/70 border border-cyan-500/20 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md">
              7-STAGE REFILL ORCHESTRATION
            </span>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="group flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-slate-900/80 px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 backdrop-blur-md transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-950/60 hover:text-white hover:shadow-[0_0_16px_rgba(0,217,255,0.4)]"
            >
              <span>Skip Intro</span>
              <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* CENTER STAGE: 3D CAPSULE + CONNECTED FLOWING WORKFLOW TREE     */}
        {/* ============================================================== */}
        <motion.div
          animate={
            isZooming
              ? {
                  scale: 5.5,
                  y: 80,
                  filter: 'blur(26px)',
                  opacity: 0,
                }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={{
            duration: isZooming ? 1.4 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex items-center justify-center w-full max-w-4xl h-[620px] pointer-events-none z-20"
        >
          {/* ──────────────────────────────────────────────────────────── */}
          {/* A. THE OPENING CAPSULE (Positioned at bottom-center origin) */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            className="absolute bottom-4 flex flex-col items-center w-[130px] sm:w-[150px] z-10"
            style={{ transform: 'rotateZ(-12deg)' }}
          >
            {/* 1. Upper Half Glass Cap */}
            <motion.div
              animate={
                isCapOpen
                  ? {
                      y: -75,
                      rotateX: 4,
                    }
                  : { y: 0, rotateX: 0 }
              }
              transition={{
                duration: 2.0,
                ease: [0.25, 1, 0.5, 1], // Slow, realistic physical lift
              }}
              className="relative w-full h-[120px] rounded-t-[75px] overflow-hidden z-20"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(77, 163, 255, 0.08) 35%, rgba(6, 36, 90, 0.35) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                borderBottom: 'none',
                boxShadow:
                  'inset 0 4px 18px rgba(255, 255, 255, 0.35), 0 -6px 20px rgba(0, 217, 255, 0.2)',
                backdropFilter: 'blur(3px)',
              }}
            >
              {/* Glass Specular Highlight Streak */}
              <div
                className="absolute top-3 left-2 w-2 h-[80px] rounded-full pointer-events-none opacity-80"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)',
                }}
              />

              {/* Pharmaceutical Laser Print */}
              <div className="absolute bottom-4 inset-x-2 text-right pr-1 font-mono text-[7px] text-cyan-200 font-semibold opacity-85">
                LUMIN-9 · 100mg
              </div>

              {/* Metallic joint ring */}
              <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-r from-slate-400 via-white to-slate-500 border-t border-white/80" />
            </motion.div>

            {/* 2. Lower Chamber */}
            <div
              className="relative w-full h-[125px] rounded-b-[75px] overflow-hidden z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(6, 36, 90, 0.85) 0%, rgba(3, 19, 47, 0.95) 40%, rgba(0, 217, 255, 0.4) 100%)',
                border: '2px solid rgba(0, 217, 255, 0.85)',
                borderTop: 'none',
                boxShadow:
                  'inset 0 0 25px rgba(0, 217, 255, 0.45), 0 8px 35px rgba(0, 217, 255, 0.4)',
              }}
            >
              {/* Metallic top ring */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-cyan-400 via-white to-teal-400" />

              {/* Holographic Heart Visual */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  filter: isCapOpen
                    ? 'drop-shadow(0 0 16px rgba(0, 217, 255, 0.9))'
                    : 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.6))',
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="size-8 text-cyan-300 fill-cyan-400/30" />
              </motion.div>

              {/* Floating Medicine Particles inside lower chamber */}
              <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    animate={
                      isCapOpen
                        ? {
                            y: [p.y, p.y - 70 - Math.random() * 40],
                            x: [p.x, p.x + (Math.random() - 0.5) * 30],
                            opacity: [0.8, 1, 0.6],
                          }
                        : {
                            y: [p.y - 3, p.y + 3, p.y - 3],
                            x: [p.x - 2, p.x + 2, p.x - 2],
                            opacity: [0.6, 0.9, 0.6],
                          }
                    }
                    transition={{
                      duration: isCapOpen ? 2.5 : 3.5,
                      repeat: isCapOpen ? 0 : Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                      left: '50%',
                      top: '50%',
                      marginLeft: p.x,
                      marginTop: p.y,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* B. THE HIERARCHICAL REFILL WORKFLOW NETWORK                  */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="relative w-full max-w-[480px] h-[580px] flex flex-col items-center justify-between pb-8 pt-2 z-20">
            {/* SVG Connecting Flow Lines with animated dash strokes */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 400 580"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="wfGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#087BFF" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#00D9FF" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
                </linearGradient>

                <filter id="wfGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Path 0: Capsule emergence -> Patient (200, 485) */}
              {isCapOpen && (
                <motion.path
                  d="M 180 570 C 190 530, 200 515, 200 485"
                  stroke="url(#wfGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                />
              )}

              {/* Path 1: Patient (200, 485) -> Prescription (200, 405) */}
              {isPatientActive && (
                <motion.path
                  d="M 200 485 L 200 405"
                  stroke="url(#wfGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Path 2: Prescription (200, 405) -> Pharmacy (200, 325) */}
              {isPrescriptionActive && (
                <motion.path
                  d="M 200 405 L 200 325"
                  stroke="url(#wfGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Path 3: Pharmacy (200, 325) -> Provider (110, 235) */}
              {isPharmacyActive && (
                <motion.path
                  d="M 200 325 C 170 290, 130 270, 110 235"
                  stroke="url(#wfGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Path 4: Pharmacy (200, 325) -> Insurance (290, 235) */}
              {isPharmacyActive && (
                <motion.path
                  d="M 200 325 C 230 290, 270 270, 290 235"
                  stroke="url(#wfGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Path 5: Provider (110, 235) -> AI (200, 130) */}
              {isProviderInsuranceActive && (
                <motion.path
                  d="M 110 235 C 135 190, 175 165, 200 130"
                  stroke="url(#wfGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}

              {/* Path 6: Insurance (290, 235) -> AI (200, 130) */}
              {isProviderInsuranceActive && (
                <motion.path
                  d="M 290 235 C 265 190, 225 165, 200 130"
                  stroke="url(#wfGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}

              {/* Path 7: AI (200, 130) -> Resolved (200, 42) */}
              {isAiActive && (
                <motion.path
                  d="M 200 130 L 200 42"
                  stroke="#10B981"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  filter="url(#wfGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              )}

              {/* Flowing Laser Medicine Pulse Animation */}
              {isPatientActive && (
                <motion.path
                  d="M 200 485 L 200 405 L 200 325 C 170 290, 130 270, 110 235 C 135 190, 175 165, 200 130 L 200 42"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeDasharray="8 28"
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: [0, -180] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </svg>

            {/* ──────────────────────────────────────────────────────── */}
            {/* WORKFLOW NODES HIERARCHY                                 */}
            {/* ──────────────────────────────────────────────────────── */}

            {/* 1. REFILL RESOLVED (Top Beacon) */}
            <motion.div
              animate={
                isResolvedActive
                  ? { scale: [1, 1.15, 1.08], opacity: 1 }
                  : { scale: 0.9, opacity: 0.35 }
              }
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center z-20"
            >
              <div
                className={`relative flex size-14 items-center justify-center rounded-full transition-all duration-500 ${
                  isResolvedActive
                    ? 'border-2 border-emerald-400 bg-gradient-to-tr from-slate-900 via-emerald-950 to-emerald-800 text-emerald-300 shadow-[0_0_35px_rgba(16,185,129,0.85)] ring-4 ring-emerald-400/30'
                    : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                }`}
              >
                <CircleCheck className="size-7" />
                {isResolvedActive && (
                  <span className="pointer-events-none absolute -inset-2 rounded-full border border-emerald-400/40 animate-ping opacity-50" />
                )}
              </div>
              <span
                className={`mt-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                  isResolvedActive ? 'text-emerald-300' : 'text-slate-500'
                }`}
              >
                Refill Resolved
              </span>
            </motion.div>

            {/* 2. OUSHADHASETU AI (Largest Node at Center) */}
            <motion.div
              animate={
                isAiActive
                  ? { scale: [1, 1.14, 1.08], opacity: 1 }
                  : { scale: 0.92, opacity: 0.35 }
              }
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center z-20"
            >
              {/* Concentric neural pulse rings */}
              {isAiActive && (
                <div className="relative">
                  <span className="pointer-events-none absolute -inset-4 rounded-full border border-cyan-400/40 animate-ping opacity-40" />
                  <span className="pointer-events-none absolute -inset-7 rounded-full border border-cyan-400/20 animate-pulse" />
                </div>
              )}

              <div
                className={`relative flex size-20 sm:size-22 items-center justify-center rounded-full transition-all duration-500 ${
                  isAiActive
                    ? 'border-3 border-cyan-300 bg-gradient-to-tr from-[#06245A] via-[#087BFF] to-[#00D9FF] text-white shadow-[0_0_45px_rgba(0,217,255,0.9)] ring-4 ring-cyan-400/50'
                    : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                }`}
              >
                <Bot className="size-10 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]" />
                <Sparkles className="absolute -top-1.5 -right-1.5 size-5 text-cyan-200 animate-spin [animation-duration:5s]" />
              </div>
              <span
                className={`mt-1 font-mono text-[11px] font-extrabold uppercase tracking-wider ${
                  isAiActive
                    ? 'text-cyan-300 drop-shadow-[0_0_12px_rgba(0,217,255,0.8)]'
                    : 'text-slate-500'
                }`}
              >
                OushadhaSetu AI
              </span>
              {isAiActive && (
                <span className="font-mono text-[9px] text-cyan-200/90 font-medium">
                  {phase === 'ai_action' || phase === 'resolved'
                    ? 'Blocker Resolved · Action Dispatched'
                    : 'Analyzing Refill Telemetry'}
                </span>
              )}
            </motion.div>

            {/* 3. PROVIDER (Left) & INSURANCE (Right) */}
            <div className="flex w-full max-w-[340px] items-center justify-between px-2 z-20">
              {/* Provider Node */}
              <motion.div
                animate={
                  isProviderInsuranceActive
                    ? { scale: [1, 1.1, 1.04], opacity: 1 }
                    : { scale: 0.9, opacity: 0.35 }
                }
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-full transition-all duration-400 ${
                    isProviderInsuranceActive
                      ? 'border border-cyan-400/90 bg-[#06245A] text-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.5)]'
                      : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                  }`}
                >
                  <Stethoscope className="size-5" />
                </div>
                <span
                  className={`mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                    isProviderInsuranceActive ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  Provider
                </span>
              </motion.div>

              {/* Insurance Node */}
              <motion.div
                animate={
                  isProviderInsuranceActive
                    ? { scale: [1, 1.1, 1.04], opacity: 1 }
                    : { scale: 0.9, opacity: 0.35 }
                }
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-full transition-all duration-400 ${
                    isProviderInsuranceActive
                      ? 'border border-cyan-400/90 bg-[#06245A] text-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.5)]'
                      : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                  }`}
                >
                  <ShieldCheck className="size-5" />
                </div>
                <span
                  className={`mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                    isProviderInsuranceActive ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  Insurance
                </span>
              </motion.div>
            </div>

            {/* 4. PHARMACY */}
            <motion.div
              animate={
                isPharmacyActive
                  ? { scale: [1, 1.1, 1.04], opacity: 1 }
                  : { scale: 0.9, opacity: 0.35 }
              }
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center z-20"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-full transition-all duration-400 ${
                  isPharmacyActive
                    ? 'border border-cyan-400/90 bg-[#06245A] text-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.5)]'
                    : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                }`}
              >
                <Building2 className="size-5" />
              </div>
              <span
                className={`mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  isPharmacyActive ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Pharmacy
              </span>
            </motion.div>

            {/* 5. PRESCRIPTION */}
            <motion.div
              animate={
                isPrescriptionActive
                  ? { scale: [1, 1.1, 1.04], opacity: 1 }
                  : { scale: 0.9, opacity: 0.35 }
              }
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center z-20"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-full transition-all duration-400 ${
                  isPrescriptionActive
                    ? 'border border-cyan-400/90 bg-[#06245A] text-cyan-300 shadow-[0_0_18px_rgba(0,217,255,0.5)]'
                    : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                }`}
              >
                <FileText className="size-5" />
              </div>
              <span
                className={`mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  isPrescriptionActive ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Prescription
              </span>
            </motion.div>

            {/* 6. PATIENT (Origin Node directly above opening capsule) */}
            <motion.div
              animate={
                isPatientActive
                  ? { scale: [1, 1.1, 1.04], opacity: 1 }
                  : { scale: 0.9, opacity: 0.35 }
              }
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center z-20"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-full transition-all duration-400 ${
                  isPatientActive
                    ? 'border border-cyan-400/90 bg-[#06245A] text-cyan-300 shadow-[0_0_18px_rgba(0,217,255,0.5)]'
                    : 'border border-slate-700 bg-slate-900/80 text-slate-500'
                }`}
              >
                <UserRound className="size-5" />
              </div>
              <span
                className={`mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  isPatientActive ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                Patient
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* BOTTOM TELEMETRY STATUS & PROGRESS (Cinematic HUD)              */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isZooming ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-6 inset-x-0 mx-auto max-w-lg px-6 z-30 flex flex-col items-center text-center"
        >
          {/* Animated Status Microcopy */}
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-cyan-300">
              {statusMessage}
            </span>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/20 backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 shadow-[0_0_14px_#00D9FF]"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between w-full font-mono text-[10px] text-slate-400">
            <span>PATIENT → RX → PHARMACY</span>
            <span className="text-cyan-400 font-bold">AI ORCHESTRATION</span>
            <span>REFILL RESOLVED</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
