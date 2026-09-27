import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserRound,
  Pill,
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

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

export type CircularPhase =
  | 'appear'
  | 'capsule_open'
  | 'particles_flow'
  | 'flow_patient'
  | 'flow_prescription'
  | 'flow_pharmacy'
  | 'flow_provider'
  | 'flow_insurance'
  | 'flow_ai'
  | 'flow_resolved'
  | 'zoom_through'
  | 'finished';

export function CapsuleEntranceSequence({ onComplete, onSkip }: CapsuleEntranceSequenceProps) {
  const [phase, setPhase] = useState<CircularPhase>('appear');
  const [statusMessage, setStatusMessage] = useState('Initializing Pharmaceutical State Engine...');
  const [progressPct, setProgressPct] = useState(0);

  // Micro medicine particles inside the capsule
  const particles = useRef<Particle[]>(
    Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 100,
      y: Math.random() * 95 - 15,
      size: Math.random() * 3.5 + 2.5,
      color:
        i % 4 === 0
          ? '#00D9FF'
          : i % 4 === 1
          ? '#087BFF'
          : i % 4 === 2
          ? '#FFFFFF'
          : '#74D7FF',
      speed: 0.6 + Math.random() * 0.7,
    }))
  ).current;

  // Master circular sequence timeline
  useEffect(() => {
    // 1. Capsule appears (0s - 1.2s)
    const t1 = setTimeout(() => {
      setPhase('capsule_open');
      setStatusMessage('Releasing Micro-Seal · Capsule Opening');
      setProgressPct(12);
    }, 1200);

    // 2. Medicine particles flow out (2.6s)
    const t2 = setTimeout(() => {
      setPhase('particles_flow');
      setStatusMessage('Particles Coalescing into Circular Orbital Stream');
      setProgressPct(24);
    }, 2600);

    // 3. Flow reaches Patient (3.6s)
    const t3 = setTimeout(() => {
      setPhase('flow_patient');
      setStatusMessage('👤 Patient Node Engaged · Refill Request Initiated');
      setProgressPct(36);
    }, 3600);

    // 4. Flow reaches Prescription (4.5s)
    const t4 = setTimeout(() => {
      setPhase('flow_prescription');
      setStatusMessage('💊 Prescription Node Engaged · Adherence Velocity Synced');
      setProgressPct(48);
    }, 4500);

    // 5. Flow reaches Pharmacy (5.4s)
    const t5 = setTimeout(() => {
      setPhase('flow_pharmacy');
      setStatusMessage('🏥 Pharmacy Node Engaged · Stock & Claim Evaluated');
      setProgressPct(60);
    }, 5400);

    // 6. Flow reaches Provider (6.3s)
    const t6 = setTimeout(() => {
      setPhase('flow_provider');
      setStatusMessage('👨‍⚕️ Provider Node Engaged · Clinical Dossier Verified');
      setProgressPct(70);
    }, 6300);

    // 7. Flow reaches Insurance (7.2s)
    const t7 = setTimeout(() => {
      setPhase('flow_insurance');
      setStatusMessage('🛡️ Insurance Node Engaged · Prior-Auth Cleared');
      setProgressPct(80);
    }, 7200);

    // 8. Flow enters OushadhaSetu AI at Center (8.2s)
    const t8 = setTimeout(() => {
      setPhase('flow_ai');
      setStatusMessage('🤖 OushadhaSetu AI Core Analyzing · Blocker Resolved');
      setProgressPct(90);
    }, 8200);

    // 9. Flow surges to Refill Resolved (9.4s)
    const t9 = setTimeout(() => {
      setPhase('flow_resolved');
      setStatusMessage('✅ Refill Resolved · Continuous Therapy Secured');
      setProgressPct(98);
    }, 9400);

    // 10. Camera push-through (10.6s)
    const t10 = setTimeout(() => {
      setPhase('zoom_through');
      setStatusMessage('Entering OushadhaSetu: "Keep Every Refill Moving"');
      setProgressPct(100);
    }, 10600);

    // 11. Complete & reveal landing page (11.8s)
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

  const isCapOpen = phase !== 'appear';
  const isWorkflowActive = phase !== 'appear' && phase !== 'capsule_open';
  const isZooming = phase === 'zoom_through';

  // Circular Orbit Geometry:
  // Box: 460 x 460, Center: (230, 230), Radius: 155
  const boxSize = 460;
  const center = boxSize / 2;
  const orbitRadius = 155;

  // 6 Orbital positions around the center AI:
  // Patient (Top: 0° / 12 o'clock)
  // Prescription (Top-Right: 60° / 2 o'clock)
  // Pharmacy (Bottom-Right: 120° / 4 o'clock)
  // Resolved (Bottom: 180° / 6 o'clock)
  // Insurance (Bottom-Left: 240° / 8 o'clock)
  // Provider (Top-Left: 300° / 10 o'clock)
  const orbitalNodes = [
    {
      id: 'patient',
      label: 'Patient',
      sub: 'Refill Request',
      icon: UserRound,
      shape: 'circle',
      angle: 0,
      active:
        phase === 'flow_patient' ||
        phase === 'flow_prescription' ||
        phase === 'flow_pharmacy' ||
        phase === 'flow_provider' ||
        phase === 'flow_insurance' ||
        phase === 'flow_ai' ||
        phase === 'flow_resolved' ||
        phase === 'zoom_through',
      isCurrent: phase === 'flow_patient',
    },
    {
      id: 'prescription',
      label: 'Prescription',
      sub: 'Dosage Verified',
      icon: Pill,
      shape: 'capsule',
      angle: 60,
      active:
        phase === 'flow_prescription' ||
        phase === 'flow_pharmacy' ||
        phase === 'flow_provider' ||
        phase === 'flow_insurance' ||
        phase === 'flow_ai' ||
        phase === 'flow_resolved' ||
        phase === 'zoom_through',
      isCurrent: phase === 'flow_prescription',
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy',
      sub: 'Dispense Ready',
      icon: Building2,
      shape: 'building',
      angle: 120,
      active:
        phase === 'flow_pharmacy' ||
        phase === 'flow_provider' ||
        phase === 'flow_insurance' ||
        phase === 'flow_ai' ||
        phase === 'flow_resolved' ||
        phase === 'zoom_through',
      isCurrent: phase === 'flow_pharmacy',
    },
    {
      id: 'resolved',
      label: 'Refill Resolved',
      sub: 'Zero Delay',
      icon: CircleCheck,
      shape: 'check',
      angle: 180,
      active: phase === 'flow_resolved' || phase === 'zoom_through',
      isCurrent: phase === 'flow_resolved',
    },
    {
      id: 'insurance',
      label: 'Insurance',
      sub: 'PA Cleared',
      icon: ShieldCheck,
      shape: 'shield',
      angle: 240,
      active:
        phase === 'flow_insurance' ||
        phase === 'flow_ai' ||
        phase === 'flow_resolved' ||
        phase === 'zoom_through',
      isCurrent: phase === 'flow_insurance',
    },
    {
      id: 'provider',
      label: 'Provider',
      sub: 'Chart Approved',
      icon: Stethoscope,
      shape: 'circle',
      angle: 300,
      active:
        phase === 'flow_provider' ||
        phase === 'flow_insurance' ||
        phase === 'flow_ai' ||
        phase === 'flow_resolved' ||
        phase === 'zoom_through',
      isCurrent: phase === 'flow_provider',
    },
  ];

  const isAiActive =
    phase === 'flow_ai' || phase === 'flow_resolved' || phase === 'zoom_through';

  return (
    <AnimatePresence>
      <motion.div
        key="circular-capsule-entrance"
        initial={{ opacity: 1 }}
        animate={{ opacity: isZooming ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020B18] select-none text-white"
        style={{ perspective: 1200 }}
      >
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#06245A_0%,_#03132F_50%,_#020B18_100%)]" />

        {/* Ambient Pulsing Cyan Backlight */}
        <motion.div
          animate={{
            scale: isAiActive ? [1.2, 1.5, 1.3] : [1, 1.15, 1],
            opacity: isAiActive ? [0.45, 0.7, 0.45] : [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute h-[650px] w-[650px] rounded-full bg-cyan-400/20 blur-[140px]"
        />

        {/* Top Header Bar */}
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
                CIRCULAR REFILL ORCHESTRATION ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-400/70 border border-cyan-500/20 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md">
              ORBITAL FLOW ACTIVE
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
        {/* CENTER STAGE: CAPSULE + CIRCULAR WORKFLOW AROUND CENTRAL AI    */}
        {/* ============================================================== */}
        <motion.div
          animate={
            isZooming
              ? {
                  scale: 5.2,
                  filter: 'blur(26px)',
                  opacity: 0,
                }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: isZooming ? 1.4 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex items-center justify-center w-full max-w-4xl h-[600px] pointer-events-none z-20"
        >
          {/* ──────────────────────────────────────────────────────────── */}
          {/* A. OPENING CAPSULE (Origin at Left-Bottom)                  */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            className="absolute -left-4 sm:left-4 bottom-4 flex flex-col items-center w-[120px] sm:w-[135px] z-10 opacity-90"
            style={{ transform: 'rotateZ(-16deg)' }}
          >
            {/* Upper Glass Cap */}
            <motion.div
              animate={
                isCapOpen
                  ? { y: -65, rotateX: 4 }
                  : { y: 0, rotateX: 0 }
              }
              transition={{ duration: 2.0, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full h-[105px] rounded-t-[70px] overflow-hidden z-20"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(77, 163, 255, 0.08) 35%, rgba(6, 36, 90, 0.35) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                borderBottom: 'none',
                boxShadow:
                  'inset 0 4px 16px rgba(255, 255, 255, 0.35), 0 -6px 20px rgba(0, 217, 255, 0.2)',
                backdropFilter: 'blur(3px)',
              }}
            >
              <div
                className="absolute top-2 left-2 w-2 h-[70px] rounded-full pointer-events-none opacity-80"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-3 inset-x-2 text-right pr-1 font-mono text-[7px] text-cyan-200 font-semibold opacity-85">
                LUMIN-9 · 100mg
              </div>
              <div className="absolute bottom-0 inset-x-0 h-2.5 bg-gradient-to-r from-slate-400 via-white to-slate-500 border-t border-white/80" />
            </motion.div>

            {/* Lower Chamber with Heart & Particles */}
            <div
              className="relative w-full h-[110px] rounded-b-[70px] overflow-hidden z-10"
              style={{
                background:
                  'linear-gradient(180deg, rgba(6, 36, 90, 0.85) 0%, rgba(3, 19, 47, 0.95) 40%, rgba(0, 217, 255, 0.4) 100%)',
                border: '2px solid rgba(0, 217, 255, 0.85)',
                borderTop: 'none',
                boxShadow:
                  'inset 0 0 25px rgba(0, 217, 255, 0.45), 0 8px 30px rgba(0, 217, 255, 0.4)',
              }}
            >
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-cyan-400 via-white to-teal-400" />

              {/* Heart visual */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="size-7 text-cyan-300 fill-cyan-400/30" />
              </motion.div>

              {/* Floating particles inside */}
              <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    animate={
                      isCapOpen
                        ? {
                            y: [p.y, p.y - 60 - Math.random() * 30],
                            x: [p.x, p.x + (Math.random() - 0.5) * 25],
                            opacity: [0.8, 1, 0.6],
                          }
                        : {
                            y: [p.y - 2, p.y + 2, p.y - 2],
                            opacity: [0.6, 0.9, 0.6],
                          }
                    }
                    transition={{
                      duration: isCapOpen ? 2.2 : 3.5,
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
          {/* B. CONFLUENT STREAM: Capsule Particles -> Circular Workflow  */}
          {/* ──────────────────────────────────────────────────────────── */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 800 600"
            fill="none"
          >
            {isWorkflowActive && (
              <motion.path
                d="M 120 480 C 180 430, 280 200, 400 145"
                stroke="url(#streamGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}
            <defs>
              <linearGradient id="streamGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#087BFF" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00D9FF" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* C. THE CIRCULAR ORBITAL WORKFLOW RIG (Center Screen)         */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            className="relative flex items-center justify-center select-none"
            style={{ width: boxSize, height: boxSize }}
          >
            {/* SVG Circular Path with glowing fluid stream */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${boxSize} ${boxSize}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="circWfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#087BFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
                </linearGradient>

                <filter id="circOrbGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Underlying Conduit Orbit Ring */}
              <circle
                cx={center}
                cy={center}
                r={orbitRadius}
                stroke="rgba(8, 123, 255, 0.18)"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* 2. Secondary Glowing Cyan Orbit Track */}
              <circle
                cx={center}
                cy={center}
                r={orbitRadius}
                stroke="url(#circWfGrad)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
                filter="url(#circOrbGlow)"
                opacity="0.6"
              />

              {/* 3. Radial Spoke Conduits to Central AI */}
              {orbitalNodes.map((n) => {
                const rad = ((n.angle - 90) * Math.PI) / 180;
                const nx = center + orbitRadius * Math.cos(rad);
                const ny = center + orbitRadius * Math.sin(rad);
                return (
                  <line
                    key={n.id}
                    x1={center}
                    y1={center}
                    x2={nx}
                    y2={ny}
                    stroke="rgba(0, 217, 255, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="3 5"
                  />
                );
              })}

              {/* 4. Active Traveling Glowing Flow Particle (Water Stream) */}
              <motion.circle
                cx={center}
                cy={center}
                r={orbitRadius}
                stroke="#00D9FF"
                strokeWidth="4"
                strokeDasharray="32 200"
                strokeLinecap="round"
                filter="url(#circOrbGlow)"
                animate={{ strokeDashoffset: [0, -1000] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />

              {/* 5. Ingress Flow into Central AI when AI phase active */}
              {isAiActive && (
                <motion.line
                  x1={center}
                  y1={center - orbitRadius}
                  x2={center}
                  y2={center}
                  stroke="#00D9FF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#circOrbGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* 6. Egress Flow from Central AI to Resolved at bottom */}
              {phase === 'flow_resolved' && (
                <motion.line
                  x1={center}
                  y1={center}
                  x2={center}
                  y2={center + orbitRadius}
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#circOrbGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}
            </svg>

            {/* ──────────────────────────────────────────────────────── */}
            {/* CENTER: OUSHADHASETU AI (Largest Node at Dead Center)    */}
            {/* ──────────────────────────────────────────────────────── */}
            <motion.div
              animate={
                isAiActive
                  ? { scale: [1, 1.15, 1.08] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute z-30 flex flex-col items-center justify-center pointer-events-none"
              style={{
                width: 96,
                height: 96,
                left: center - 48,
                top: center - 48,
              }}
            >
              {/* Concentric neural pulse rings */}
              <span className="pointer-events-none absolute -inset-3 rounded-full border border-cyan-400/40 animate-ping opacity-35" />
              <span className="pointer-events-none absolute -inset-6 rounded-full border border-cyan-400/20 animate-pulse" />

              <div
                className={`relative flex size-full items-center justify-center rounded-full border-3 transition-all duration-500 ${
                  isAiActive
                    ? 'border-cyan-300 bg-gradient-to-tr from-[#06245A] via-[#087BFF] to-[#00D9FF] text-white shadow-[0_0_40px_rgba(0,217,255,0.85)] ring-4 ring-cyan-400/40'
                    : 'border-slate-700 bg-slate-900/90 text-slate-400'
                }`}
              >
                <Bot className="size-10 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]" />
                <Sparkles className="absolute -top-1 -right-1 size-5 text-cyan-200 animate-spin [animation-duration:5s]" />
              </div>

              {/* Center Typography */}
              <div className="absolute -bottom-6 w-36 text-center pointer-events-none">
                <span className="block font-mono text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]">
                  OushadhaSetu AI
                </span>
                <span className="block text-[8.5px] font-mono text-slate-300">
                  {phase === 'flow_ai'
                    ? 'Analyzing Refill Blocker...'
                    : phase === 'flow_resolved'
                    ? 'Blocker Resolved'
                    : 'Central Engine'}
                </span>
              </div>
            </motion.div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* ORBITAL NODES (Circular Ring around AI)                  */}
            {/* ──────────────────────────────────────────────────────── */}
            {orbitalNodes.map((n) => {
              const rad = ((n.angle - 90) * Math.PI) / 180;
              const x = center + orbitRadius * Math.cos(rad);
              const y = center + orbitRadius * Math.sin(rad);
              const Icon = n.icon;
              const isResolved = n.id === 'resolved';

              return (
                <div
                  key={n.id}
                  className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: x, top: y }}
                >
                  <motion.div
                    animate={
                      n.isCurrent
                        ? { scale: [1, 1.18, 1.1] }
                        : n.active
                        ? { scale: 1 }
                        : { scale: 0.94 }
                    }
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`relative flex items-center justify-center transition-all duration-400 ${
                      /* Node Shape Variations as requested: */
                      n.shape === 'capsule'
                        ? 'h-11 px-3.5 rounded-full border-2' // Pill/capsule-shaped
                        : n.shape === 'building'
                        ? 'size-12 rounded-2xl border-2' // Rounded building
                        : n.shape === 'shield'
                        ? 'size-12 rounded-xl border-2 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]' // Shield visual
                        : n.shape === 'check'
                        ? 'size-14 rounded-full border-2' // Glowing check-circle
                        : 'size-12 rounded-full border-2' // Circular medical
                    } ${
                      isResolved && n.active
                        ? 'border-emerald-400 bg-gradient-to-tr from-slate-900 to-emerald-950 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.85)] ring-4 ring-emerald-400/30'
                        : n.isCurrent
                        ? 'border-cyan-300 bg-[#06245A] text-cyan-200 shadow-[0_0_24px_rgba(0,217,255,0.8)] ring-3 ring-cyan-400/50'
                        : n.active
                        ? 'border-cyan-500/80 bg-[#06245A]/90 text-cyan-300 shadow-[0_0_16px_rgba(0,217,255,0.4)]'
                        : 'border-slate-700/70 bg-slate-950/80 text-slate-500'
                    }`}
                  >
                    <Icon className="size-5" />

                    {n.shape === 'capsule' && (
                      <span className="ml-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                        Rx
                      </span>
                    )}

                    {isResolved && n.active && (
                      <span className="pointer-events-none absolute -inset-2 rounded-full border border-emerald-400/40 animate-ping opacity-60" />
                    )}
                  </motion.div>

                  {/* Node Label */}
                  <div
                    className={`mt-1.5 text-center transition-all duration-300 ${
                      n.isCurrent ? 'opacity-100 scale-105' : 'opacity-85 scale-100'
                    }`}
                  >
                    <span
                      className={`block font-mono text-[10px] font-semibold tracking-wider uppercase ${
                        isResolved && n.active
                          ? 'text-emerald-300 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                          : n.isCurrent
                          ? 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]'
                          : n.active
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {n.label}
                    </span>
                    <span className="block font-mono text-[8px] text-slate-400">
                      {n.sub}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* BOTTOM TELEMETRY HUD                                           */}
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
            <span>ORBITAL REFILL INGEST</span>
            <span className="text-cyan-400 font-bold">CENTRAL AI RESOLUTION</span>
            <span>ZERO LAPSE DISPENSE</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
