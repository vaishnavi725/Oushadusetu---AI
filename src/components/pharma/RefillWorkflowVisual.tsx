import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  UserRound,
  Pill,
  Building2,
  Stethoscope,
  ShieldCheck,
  Bot,
  CircleCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export type CircularStepId =
  | 'patient'
  | 'prescription'
  | 'pharmacy'
  | 'provider'
  | 'insurance'
  | 'ai'
  | 'resolved';

export interface CircularWorkflowNode {
  id: CircularStepId;
  label: string;
  sub: string;
  icon: typeof UserRound;
  shape: 'circle' | 'capsule' | 'building' | 'shield' | 'check' | 'ai-center';
  angle: number; // degrees for circular placement (0° = 12 o'clock, clockwise)
  radiusFactor?: number;
}

export const CIRCULAR_NODES: CircularWorkflowNode[] = [
  {
    id: 'patient',
    label: 'Patient',
    sub: 'Refill Request',
    icon: UserRound,
    shape: 'circle',
    angle: 0, // 12 o'clock (Top)
  },
  {
    id: 'prescription',
    label: 'Prescription',
    sub: 'Active Rx Data',
    icon: Pill,
    shape: 'capsule',
    angle: 60, // 2 o'clock
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    sub: 'Dispense Check',
    icon: Building2,
    shape: 'building',
    angle: 120, // 4 o'clock
  },
  {
    id: 'resolved',
    label: 'Refill Resolved',
    sub: 'Continuous Therapy',
    icon: CircleCheck,
    shape: 'check',
    angle: 180, // 6 o'clock (Bottom prominent state)
  },
  {
    id: 'insurance',
    label: 'Insurance',
    sub: 'Formulary & PA',
    icon: ShieldCheck,
    shape: 'shield',
    angle: 240, // 8 o'clock
  },
  {
    id: 'provider',
    label: 'Provider',
    sub: 'Clinical Review',
    icon: Stethoscope,
    shape: 'circle',
    angle: 300, // 10 o'clock
  },
];

interface RefillWorkflowVisualProps {
  mode?: 'circular' | 'ribbon' | 'network' | 'hero';
  activeStep?: CircularStepId | 'all' | 'idle';
  interactive?: boolean;
  onStepClick?: (step: CircularStepId) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RefillWorkflowVisual({
  mode = 'circular',
  activeStep = 'all',
  interactive = true,
  onStepClick,
  className = '',
  size = 'md',
}: RefillWorkflowVisualProps) {
  const [hoveredNode, setHoveredNode] = useState<CircularStepId | null>(null);

  // Active step flow order:
  // Patient -> Prescription -> Pharmacy -> Provider -> Insurance -> AI -> Resolved
  const flowOrder: CircularStepId[] = [
    'patient',
    'prescription',
    'pharmacy',
    'provider',
    'insurance',
    'ai',
    'resolved',
  ];

  const [activeIdx, setActiveIdx] = useState<number>(
    activeStep === 'all' ? flowOrder.length - 1 : activeStep === 'idle' ? -1 : 0
  );

  // Auto-cycle the circular flow particle when interactive
  useEffect(() => {
    if (activeStep !== 'all' && activeStep !== 'idle') {
      const idx = flowOrder.indexOf(activeStep);
      if (idx !== -1) setActiveIdx(idx);
      return;
    }

    if (activeStep === 'all') {
      const timer = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % flowOrder.length);
      }, 2400);
      return () => clearInterval(timer);
    }
  }, [activeStep]);

  const isNodeActive = (id: CircularStepId) => {
    if (activeStep === 'all') return true;
    if (activeStep === 'idle') return false;
    const currentActiveId = flowOrder[activeIdx];
    return id === currentActiveId || activeStep === id;
  };

  const isCurrentPulse = (id: CircularStepId) => {
    if (hoveredNode) return hoveredNode === id;
    return flowOrder[activeIdx] === id;
  };

  // Dimensions based on size prop
  const dimensions = {
    sm: { box: 320, radius: 110, centerSize: 72 },
    md: { box: 420, radius: 145, centerSize: 88 },
    lg: { box: 480, radius: 170, centerSize: 98 },
  }[size];

  const center = dimensions.box / 2;
  const radius = dimensions.radius;

  // ──────────────────────────────────────────────────────────────────────────
  // 1. HORIZONTAL RIBBON MODE (For Tables / Headers)
  // ──────────────────────────────────────────────────────────────────────────
  if (mode === 'ribbon') {
    return (
      <div
        className={`relative flex items-center justify-between gap-1 overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#03132F]/85 p-3 backdrop-blur-md ${className}`}
      >
        <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-emerald-500/30" />

        {flowOrder.map((stepId, i) => {
          const active = isNodeActive(stepId);
          const current = isCurrentPulse(stepId);
          const isAi = stepId === 'ai';
          const isResolved = stepId === 'resolved';

          const label =
            stepId === 'patient'
              ? 'Patient'
              : stepId === 'prescription'
              ? 'Prescription'
              : stepId === 'pharmacy'
              ? 'Pharmacy'
              : stepId === 'provider'
              ? 'Provider'
              : stepId === 'insurance'
              ? 'Insurance'
              : stepId === 'ai'
              ? 'OushadhaSetu AI'
              : 'Refill Resolved';

          return (
            <div key={stepId} className="relative z-10 flex items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(stepId)}
                onMouseEnter={() => setHoveredNode(stepId)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`group flex flex-col items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 ${
                  interactive ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center rounded-xl transition-all duration-300 ${
                    isAi
                      ? 'size-9 border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.5)]'
                      : isResolved
                      ? 'size-8 border border-emerald-400/80 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : active
                      ? 'size-8 border border-cyan-500/40 bg-slate-900 text-cyan-400'
                      : 'size-8 border border-slate-700/60 bg-slate-950/60 text-slate-500'
                  } ${current ? 'ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-[#03132F]' : ''}`}
                >
                  {isAi ? (
                    <Bot className="size-5" />
                  ) : isResolved ? (
                    <CircleCheck className="size-4" />
                  ) : stepId === 'patient' ? (
                    <UserRound className="size-4" />
                  ) : stepId === 'prescription' ? (
                    <Pill className="size-4" />
                  ) : stepId === 'pharmacy' ? (
                    <Building2 className="size-4" />
                  ) : stepId === 'provider' ? (
                    <Stethoscope className="size-4" />
                  ) : (
                    <ShieldCheck className="size-4" />
                  )}
                  {current && (
                    <span className="absolute -top-1 -right-1 flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <span
                    className={`block font-mono text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                      active ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </button>

              {i < flowOrder.length - 1 && (
                <ArrowRight
                  className={`size-3 shrink-0 mx-1 transition-colors ${
                    active ? 'text-cyan-400' : 'text-slate-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CIRCULAR ORBITAL WORKFLOW (Primary Visual Architecture)
  //
  //                      [👤 PATIENT]
  //              💊                          🏥
  //         PRESCRIPTION                  PHARMACY
  //
  //                    [🤖 OUSHADHA AI] (Center)
  //
  //              👨‍⚕️                          🛡️
  //           PROVIDER                   INSURANCE
  //                      [✅ RESOLVED]
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`relative mx-auto flex items-center justify-center select-none ${className}`}
      style={{
        width: dimensions.box,
        height: dimensions.box,
      }}
    >
      {/* Background Volumetric Cyan Radiance */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full bg-cyan-500/10 blur-[85px]"
          style={{ width: dimensions.box * 0.75, height: dimensions.box * 0.75 }}
        />
      </div>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* SVG CIRCULAR TRACK & GLOWING FLOW RAYS                        */}
      {/* ────────────────────────────────────────────────────────────── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${dimensions.box} ${dimensions.box}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circularFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#087BFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
          </linearGradient>

          <filter id="circGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
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
          r={radius}
          stroke="rgba(8, 123, 255, 0.16)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 2. Secondary Glowing Cyan Orbit Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#circularFlowGrad)"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          filter="url(#circGlow)"
          opacity="0.6"
        />

        {/* 3. Central AI Ingress/Egress Radial Beams */}
        {CIRCULAR_NODES.map((node) => {
          const rad = ((node.angle - 90) * Math.PI) / 180;
          const nx = center + radius * Math.cos(rad);
          const ny = center + radius * Math.sin(rad);

          return (
            <line
              key={node.id}
              x1={center}
              y1={center}
              x2={nx}
              y2={ny}
              stroke="rgba(0, 217, 255, 0.12)"
              strokeWidth="1.5"
              strokeDasharray="3 5"
            />
          );
        })}

        {/* 4. Active Animated Traveling Flow Particle (Glowing Water Stream) */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#00D9FF"
          strokeWidth="3.5"
          strokeDasharray="28 240"
          strokeLinecap="round"
          filter="url(#circGlow)"
          animate={{ strokeDashoffset: [0, -1000] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* 5. Reverse White Micro-Packet Stream */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="10 320"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [-200, -1200] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* CENTER: OUSHADHASETU AI (The Largest Central Element)          */}
      {/* ────────────────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => onStepClick?.('ai')}
        onMouseEnter={() => setHoveredNode('ai')}
        onMouseLeave={() => setHoveredNode(null)}
        animate={
          isCurrentPulse('ai')
            ? { scale: [1, 1.08, 1.04] }
            : { scale: 1 }
        }
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="group absolute z-30 flex flex-col items-center justify-center cursor-pointer focus:outline-none"
        style={{
          width: dimensions.centerSize,
          height: dimensions.centerSize,
          left: center - dimensions.centerSize / 2,
          top: center - dimensions.centerSize / 2,
        }}
      >
        {/* Concentric Glowing Neural Pulse Rings */}
        <span className="pointer-events-none absolute -inset-3 rounded-full border border-cyan-400/40 animate-ping opacity-35" />
        <span className="pointer-events-none absolute -inset-6 rounded-full border border-cyan-400/20 animate-pulse" />

        {/* Center AI Node Spherical Housing */}
        <div className="relative flex size-full items-center justify-center rounded-full border-3 border-cyan-300 bg-gradient-to-tr from-[#06245A] via-[#087BFF] to-[#00D9FF] text-white shadow-[0_0_35px_rgba(0,217,255,0.7)] ring-4 ring-cyan-400/30 transition-transform duration-300 group-hover:scale-105">
          <Bot className="size-8 sm:size-9 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]" />
          <Sparkles className="absolute -top-1 -right-1 size-4 text-cyan-200 animate-spin [animation-duration:5s]" />
        </div>

        {/* Small Central Floating Typography */}
        <div className="absolute -bottom-6 w-32 text-center pointer-events-none">
          <span className="block font-mono text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]">
            OushadhaSetu AI
          </span>
          <span className="block text-[8px] font-mono text-slate-400">
            Orchestration Core
          </span>
        </div>
      </motion.button>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* ORBITAL NODES (Arranged in Circle around AI)                   */}
      {/* ────────────────────────────────────────────────────────────── */}
      {CIRCULAR_NODES.map((node) => {
        const rad = ((node.angle - 90) * Math.PI) / 180;
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);

        const active = isNodeActive(node.id);
        const current = isCurrentPulse(node.id);
        const Icon = node.icon;
        const isResolved = node.id === 'resolved';

        return (
          <div
            key={node.id}
            className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
          >
            <motion.button
              type="button"
              onClick={() => onStepClick?.(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              animate={
                current
                  ? { scale: [1, 1.14, 1.08] }
                  : active
                  ? { scale: 1 }
                  : { scale: 0.94 }
              }
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`group relative flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none ${
                /* Node Shape Variations as requested: */
                node.shape === 'capsule'
                  ? 'h-11 px-3.5 rounded-full border-2' // Pill/capsule-shaped
                  : node.shape === 'building'
                  ? 'size-12 rounded-2xl border-2' // Rounded building shape
                  : node.shape === 'shield'
                  ? 'size-12 rounded-xl border-2 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]' // Shield visual
                  : node.shape === 'check'
                  ? 'size-14 rounded-full border-2' // Glowing check-circle
                  : 'size-12 rounded-full border-2' // Standard circular node
              } ${
                isResolved
                  ? 'border-emerald-400 bg-gradient-to-tr from-slate-900 to-emerald-950 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                  : current
                  ? 'border-cyan-300 bg-[#06245A] text-cyan-200 shadow-[0_0_20px_rgba(0,217,255,0.7)] ring-2 ring-cyan-400/40'
                  : active
                  ? 'border-cyan-500/80 bg-[#06245A]/90 text-cyan-300 shadow-[0_0_14px_rgba(0,217,255,0.35)]'
                  : 'border-slate-700/70 bg-slate-950/80 text-slate-500'
              }`}
            >
              <Icon className="size-5 transition-transform duration-200 group-hover:scale-110" />

              {/* Special Pill Divider for Prescription */}
              {node.shape === 'capsule' && (
                <span className="ml-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                  Rx
                </span>
              )}

              {/* Active Beacon Ping for Resolved */}
              {isResolved && current && (
                <span className="pointer-events-none absolute -inset-2 rounded-full border border-emerald-400/40 animate-ping opacity-60" />
              )}
            </motion.button>

            {/* Label and Micro-Copy below or above node */}
            <div
              className={`mt-1.5 text-center pointer-events-none transition-all duration-300 ${
                current ? 'opacity-100 scale-105' : 'opacity-85 scale-100'
              }`}
            >
              <span
                className={`block font-mono text-[10px] font-semibold tracking-wider uppercase ${
                  isResolved
                    ? 'text-emerald-300 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
                    : current
                    ? 'text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(0,217,255,0.8)]'
                    : active
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}
              >
                {node.label}
              </span>
              <span className="block font-mono text-[8px] text-slate-400">
                {node.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
