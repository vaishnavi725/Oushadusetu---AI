import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ChevronRight, Heart } from 'lucide-react';

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

export function CapsuleEntranceSequence({ onComplete, onSkip }: CapsuleEntranceSequenceProps) {
  // Stages:
  // 0: 'appear'       - Capsule fades in, dark navy background, center stage
  // 1: 'closed_idle'  - Ambient breathing, heart beating, particles moving inside
  // 2: 'opening'      - Upper cap smoothly lifts upward, vacuum seal releases
  // 3: 'dispersing'   - Medicine particles drift upward into the open gap
  // 4: 'pause'        - Brief poise, energy gathers at core
  // 5: 'flow_emerge'  - Soft cyan light and energy stream emerges and swirls
  // 6: 'zoom_through' - Camera pushes forward through the capsule into landing page
  // 7: 'finished'     - Trigger onComplete
  const [stage, setStage] = useState<
    'appear' | 'closed_idle' | 'opening' | 'dispersing' | 'pause' | 'flow_emerge' | 'zoom_through' | 'finished'
  >('appear');

  const [statusMessage, setStatusMessage] = useState('Initializing Pharmaceutical State Engine...');
  const [progressPct, setProgressPct] = useState(0);

  // Generate realistic pharmaceutical microspheres
  const particles = useRef<Particle[]>(
    Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 110, // contained in capsule width
      y: Math.random() * 110 - 20, // inside chamber
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
    // 0 -> 1: Capsule appears and settles (1.4s)
    const t1 = setTimeout(() => {
      setStage('closed_idle');
      setStatusMessage('Telemetry Core Active · Molecular Integrity Verified');
      setProgressPct(20);
    }, 1400);

    // 1 -> 2: Capsule gently opens (starts at 2.6s)
    const t2 = setTimeout(() => {
      setStage('opening');
      setStatusMessage('Releasing Micro-Seal · Capsule Opening');
      setProgressPct(42);
    }, 2600);

    // 2 -> 3: Medicine particles naturally move upward (starts at 4.6s)
    const t3 = setTimeout(() => {
      setStage('dispersing');
      setStatusMessage('Active Medicine Micro-particles Mobilising');
      setProgressPct(65);
    }, 4600);

    // 3 -> 4: Brief pause (starts at 5.8s)
    const t4 = setTimeout(() => {
      setStage('pause');
      setStatusMessage('Poised · Luminous Core Harmonisation');
      setProgressPct(78);
    }, 5800);

    // 4 -> 5: Soft cyan light and flow emerges (starts at 6.6s)
    const t5 = setTimeout(() => {
      setStage('flow_emerge');
      setStatusMessage('Cyan Refill Stream Emergence');
      setProgressPct(90);
    }, 6600);

    // 5 -> 6: Camera moves forward through the capsule (starts at 8.2s)
    const t6 = setTimeout(() => {
      setStage('zoom_through');
      setStatusMessage('Entering OushadhaSetu Refill Pipeline...');
      setProgressPct(100);
    }, 8200);

    // 6 -> 7: Complete and hand over to landing page (starts at 9.6s)
    const t7 = setTimeout(() => {
      setStage('finished');
      onComplete();
    }, 9600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  if (stage === 'finished') return null;

  const isCapOpen =
    stage === 'opening' ||
    stage === 'dispersing' ||
    stage === 'pause' ||
    stage === 'flow_emerge' ||
    stage === 'zoom_through';

  const isFlowActive = stage === 'flow_emerge' || stage === 'zoom_through';
  const isZooming = stage === 'zoom_through';

  return (
    <AnimatePresence>
      <motion.div
        key="capsule-entrance-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isZooming ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#020B18] select-none text-white"
        style={{ perspective: 1200 }}
      >
        {/* Background Deep Space & Medical Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#06245A_0%,_#03132F_45%,_#020B18_100%)]" />

        {/* Ambient Pulsing Cyan Backlight */}
        <motion.div
          animate={{
            scale: isFlowActive ? [1.2, 1.6, 1.4] : [1, 1.15, 1],
            opacity: isFlowActive ? [0.45, 0.75, 0.55] : [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[120px]"
        />

        {/* Subtle Radial Electric Blue Flare */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="pointer-events-none absolute h-[650px] w-[650px] rounded-full bg-blue-600/15 blur-[140px]"
        />

        {/* Top Floating Telemetry Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isZooming ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-6 inset-x-0 mx-auto max-w-5xl px-6 flex items-center justify-between z-30"
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
                TELEMETRY REFILL BRIDGE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block font-mono text-[11px] text-cyan-400/70 border border-cyan-500/20 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md">
              CAPSULE REF: #2F01F658-LUMIN-9
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
        {/* CENTER CAPSULE RIG (3D Camera container) */}
        {/* ============================================================== */}
        <motion.div
          animate={
            isZooming
              ? {
                  scale: 6.2,
                  y: 40,
                  filter: 'blur(28px)',
                  opacity: 0,
                }
              : stage === 'appear'
              ? { scale: [0.92, 1], opacity: [0, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            isZooming
              ? { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
              : { duration: 1.4, ease: 'easeOut' }
          }
          className="relative flex items-center justify-center z-20 pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateZ(-20deg)', // Subtle elegant angle matching pharmaceutical reference
          }}
        >
          {/* External Halo Glow around capsule */}
          <div className="absolute -inset-10 rounded-[120px] bg-gradient-to-t from-cyan-500/30 via-sky-400/20 to-transparent blur-2xl pointer-events-none" />

          {/* CAPSULE BODY CONTAINER */}
          <div className="relative flex flex-col items-center w-[170px] sm:w-[190px]">
            {/* -------------------------------------------------------- */}
            {/* 1. UPPER HALF: Transparent Pharmaceutical Glass Cap */}
            {/* -------------------------------------------------------- */}
            <motion.div
              animate={
                isCapOpen
                  ? {
                      y: isZooming ? -160 : -95,
                      rotateX: 4,
                      opacity: 1,
                    }
                  : { y: 0, rotateX: 0, opacity: 1 }
              }
              transition={{
                duration: 2.3,
                ease: [0.25, 1, 0.5, 1], // Slow, realistic physical lift — NO BOUNCE
              }}
              className="relative w-full h-[180px] sm:h-[195px] rounded-t-[95px] overflow-hidden z-20"
              style={{
                // Realistic crystal glass refraction with glossy sheen
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(77, 163, 255, 0.08) 35%, rgba(6, 36, 90, 0.35) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.45)',
                borderBottom: 'none',
                boxShadow:
                  'inset 0 4px 22px rgba(255, 255, 255, 0.35), inset -3px 0 12px rgba(0, 217, 255, 0.2), 0 -8px 25px rgba(0, 217, 255, 0.15)',
                backdropFilter: 'blur(3px)',
              }}
            >
              {/* Glass Specular Curved Highlight on Left */}
              <div
                className="absolute top-4 left-3 w-3 h-[130px] rounded-full pointer-events-none opacity-80"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.15) 80%, transparent 100%)',
                  filter: 'blur(1.5px)',
                }}
              />

              {/* Secondary Specular Glint on Dome */}
              <div
                className="absolute top-2 inset-x-8 h-4 rounded-full pointer-events-none opacity-70"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, transparent 70%)',
                }}
              />

              {/* Laser-Etched Pharmaceutical Micro-Typography on Cap (matching reference image) */}
              <div className="absolute bottom-5 inset-x-3 text-right pr-2 select-none pointer-events-none opacity-90">
                <div className="font-mono text-[8px] sm:text-[9px] tracking-wider text-cyan-200 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  MED-TEK 3D · LUMIN-9
                </div>
                <div className="font-mono text-[7px] sm:text-[8px] tracking-widest text-slate-300">
                  DOSE 100mg · RX-SYNC
                </div>
                {/* Tiny simulated micro-barcode & icons */}
                <div className="mt-1 flex items-center justify-end gap-1 opacity-75">
                  <div className="w-1.5 h-1.5 rounded-sm bg-cyan-400" />
                  <div className="w-3 h-0.5 bg-white/70" />
                  <div className="w-4 h-0.5 bg-cyan-300/80" />
                  <div className="w-2 h-0.5 bg-white/60" />
                </div>
              </div>

              {/* Metal Joint Ring at bottom of cap */}
              <div
                className="absolute bottom-0 inset-x-0 h-3.5 z-30"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(148, 163, 184, 0.9) 0%, rgba(255, 255, 255, 0.95) 45%, rgba(100, 116, 139, 0.9) 100%)',
                  borderTop: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.45)',
                }}
              />
            </motion.div>

            {/* -------------------------------------------------------- */}
            {/* SEAM GAP: Cryogenic Vapor & Emerging Cyan Flow */}
            {/* -------------------------------------------------------- */}
            <div className="relative w-full h-0 flex items-center justify-center z-10">
              {/* Release condensation vapor upon separation */}
              <AnimatePresence>
                {stage === 'opening' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.65, 0], scale: [0.8, 1.4, 1.8], y: [-5, -25] }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    className="absolute h-10 w-44 rounded-full bg-cyan-300/30 blur-xl pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* EMERGENCE: Expanding Cyan Light Stream / Flow */}
              <AnimatePresence>
                {isFlowActive && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0, scaleX: 0.6 }}
                    animate={{
                      opacity: [0, 1, 0.9],
                      scaleY: isZooming ? 4.5 : [0, 1.2, 1],
                      scaleX: isZooming ? 3.5 : [0.6, 1.3, 1.1],
                    }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -top-12 z-40 flex flex-col items-center pointer-events-none"
                  >
                    {/* Glowing Cyan Ribbon Stream */}
                    <svg
                      className="w-48 h-64 overflow-visible"
                      viewBox="0 0 100 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="cyanBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.95" />
                          <stop offset="50%" stopColor="#087BFF" stopOpacity="0.75" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="6" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Animated Flow Spine */}
                      <motion.path
                        d="M 50 190 C 35 140, 65 90, 50 20"
                        stroke="url(#cyanBeamGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        filter="url(#cyanGlow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />

                      {/* Radiating Light Rays */}
                      <motion.path
                        d="M 50 180 C 15 130, 85 70, 50 0"
                        stroke="#00D9FF"
                        strokeWidth="3"
                        strokeDasharray="8 6"
                        opacity="0.8"
                        animate={{ strokeDashoffset: [0, -60] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>

                    {/* Central Core Luminescent Flare */}
                    <div className="absolute top-24 size-24 rounded-full bg-cyan-300 blur-2xl opacity-90 animate-pulse" />
                    <div className="absolute top-28 size-10 rounded-full bg-white blur-md opacity-95" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* -------------------------------------------------------- */}
            {/* 2. LOWER HALF: Illuminated Bioluminescent Base Chamber */}
            {/* -------------------------------------------------------- */}
            <div
              className="relative w-full h-[185px] sm:h-[200px] rounded-b-[95px] overflow-hidden z-10"
              style={{
                // Glowing cyan and electric blue liquid chamber
                background:
                  'linear-gradient(180deg, rgba(6, 36, 90, 0.85) 0%, rgba(3, 19, 47, 0.95) 40%, rgba(0, 217, 255, 0.35) 100%)',
                border: '2px solid rgba(0, 217, 255, 0.85)',
                borderTop: 'none',
                boxShadow:
                  'inset 0 0 35px rgba(0, 217, 255, 0.45), 0 10px 45px rgba(0, 217, 255, 0.4)',
              }}
            >
              {/* Metallic Top Collar Ring of Lower Chamber */}
              <div
                className="absolute top-0 inset-x-0 h-4 z-30"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(3, 19, 47, 0.9) 0%, rgba(0, 217, 255, 0.8) 50%, rgba(3, 19, 47, 0.9) 100%)',
                  borderBottom: '1px solid rgba(0, 217, 255, 0.6)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div className="flex items-center justify-between px-3 h-full">
                  <span className="font-mono text-[7px] text-cyan-300 uppercase tracking-widest">
                    OUSHADHA-SYNC
                  </span>
                  <div className="size-1 rounded-full bg-cyan-400 animate-ping" />
                </div>
              </div>

              {/* Bioluminescent Pool Glow inside Base */}
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-cyan-500/40 via-blue-600/20 to-transparent pointer-events-none" />

              {/* Glass Rim Highlight on Right */}
              <div
                className="absolute bottom-6 right-3 w-2.5 h-[120px] rounded-full pointer-events-none opacity-60"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(0,217,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
                  filter: 'blur(1px)',
                }}
              />

              {/* ------------------------------------------------------ */}
              {/* A. HOLOGRAPHIC MEDICAL HEART / PULSE VISUAL AT CORE     */}
              {/* ------------------------------------------------------ */}
              <motion.div
                animate={{
                  scale: [1, 1.07, 1.02, 1.1, 1], // Natural cardiac lub-dub pulse
                  filter: isFlowActive
                    ? 'drop-shadow(0 0 25px rgba(0, 217, 255, 1))'
                    : 'drop-shadow(0 0 12px rgba(0, 217, 255, 0.7))',
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
              >
                {/* Stylized Anatomical Heart & EKG Wave Silhouette */}
                <div className="relative flex items-center justify-center">
                  <Heart className="size-14 text-cyan-300 fill-cyan-400/25 stroke-[1.5]" />
                  {/* Glowing Core Dot */}
                  <div className="absolute size-3 rounded-full bg-white shadow-[0_0_12px_#00D9FF] animate-pulse" />
                </div>

                {/* EKG Pulse Line */}
                <svg
                  className="w-24 h-6 mt-1 overflow-visible"
                  viewBox="0 0 100 24"
                  fill="none"
                >
                  <motion.path
                    d="M 0 12 L 35 12 L 42 3 L 50 21 L 58 6 L 65 14 L 72 12 L 100 12"
                    stroke="#00D9FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0.3 }}
                    animate={{ pathLength: [0.3, 1, 0.3] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>

              {/* ------------------------------------------------------ */}
              {/* B. MEDICINE PARTICLES (Floating Microspheres)          */}
              {/* ------------------------------------------------------ */}
              <div className="absolute inset-0 z-15 pointer-events-none">
                {particles.map((p) => {
                  // When capsule opens and disperses, particles naturally float upward
                  const shouldRise =
                    stage === 'dispersing' ||
                    stage === 'pause' ||
                    stage === 'flow_emerge' ||
                    stage === 'zoom_through';

                  return (
                    <motion.div
                      key={p.id}
                      animate={
                        shouldRise
                          ? {
                              y: [p.y, p.y - 70 - Math.random() * 50],
                              x: [p.x, p.x + (Math.random() - 0.5) * 35],
                              opacity: [0.85, 1, 0.9],
                              scale: [1, 1.2, 1],
                            }
                          : {
                              y: [p.y - 4, p.y + 4, p.y - 4],
                              x: [p.x - 2, p.x + 2, p.x - 2],
                              opacity: [0.6, 0.95, 0.6],
                            }
                      }
                      transition={{
                        duration: shouldRise ? 2.5 : 3.5,
                        repeat: shouldRise ? 0 : Infinity,
                        ease: 'easeInOut',
                        delay: p.id * 0.02,
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
                  );
                })}
              </div>

              {/* Subtle Medical Grid Watermark on Lower Half */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center opacity-40">
                <span className="font-mono text-[8px] text-cyan-200 tracking-widest uppercase">
                  OUSHADHASETU · AI ENGINE
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* BOTTOM TELEMETRY STATUS & PROGRESS (Cinematic HUD)              */}
        {/* ============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isZooming ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-8 inset-x-0 mx-auto max-w-md px-6 z-30 flex flex-col items-center text-center"
        >
          {/* Animated Status Microcopy */}
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
            </span>
            <span className="font-mono text-xs font-medium tracking-wide text-cyan-300">
              {statusMessage}
            </span>
          </div>

          {/* Smooth Thin Progress Bar */}
          <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/20 backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-white shadow-[0_0_12px_#00D9FF]"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between w-full font-mono text-[10px] text-slate-500">
            <span>CLINICAL GATE: LOCKED</span>
            <span>AUTONOMOUS ORCHESTRATION</span>
            <span>60 FPS PHYSICAL SIM</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
