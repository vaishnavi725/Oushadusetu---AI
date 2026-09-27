import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  UserRound,
  FileText,
  Building2,
  Stethoscope,
  ShieldCheck,
  Bot,
  CircleCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export type WorkflowStepId =
  | 'patient'
  | 'prescription'
  | 'pharmacy'
  | 'provider'
  | 'insurance'
  | 'ai'
  | 'resolved';

export interface WorkflowNode {
  id: WorkflowStepId;
  label: string;
  sub: string;
  icon: typeof UserRound;
  actionText?: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: 'patient',
    label: 'Patient',
    sub: 'Refill Request',
    icon: UserRound,
    actionText: 'Telemetry Triggered',
    size: 'md',
  },
  {
    id: 'prescription',
    label: 'Prescription',
    sub: 'Active Rx Data',
    icon: FileText,
    actionText: 'Rx Verified',
    size: 'md',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    sub: 'Inventory & Claim',
    icon: Building2,
    actionText: 'Dispense Check',
    size: 'md',
  },
  {
    id: 'provider',
    label: 'Provider',
    sub: 'Clinical Review',
    icon: Stethoscope,
    actionText: 'Chart Evaluated',
    size: 'md',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    sub: 'Formulary & PA',
    icon: ShieldCheck,
    actionText: 'PA Cleared',
    size: 'md',
  },
  {
    id: 'ai',
    label: 'OushadhaSetu AI',
    sub: 'Orchestration Engine',
    icon: Bot,
    actionText: 'Blocker Resolved',
    size: 'xl',
  },
  {
    id: 'resolved',
    label: 'Refill Resolved',
    sub: 'Zero Delay Dispensed',
    icon: CircleCheck,
    actionText: 'Continuous Therapy',
    size: 'lg',
  },
];

interface RefillWorkflowVisualProps {
  mode?: 'network' | 'ribbon' | 'hero';
  activeStep?: WorkflowStepId | 'all' | 'idle';
  interactive?: boolean;
  onStepClick?: (step: WorkflowStepId) => void;
  className?: string;
}

export function RefillWorkflowVisual({
  mode = 'network',
  activeStep = 'all',
  interactive = true,
  onStepClick,
  className = '',
}: RefillWorkflowVisualProps) {
  const [hoveredNode, setHoveredNode] = useState<WorkflowStepId | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(
    activeStep === 'all' ? 6 : activeStep === 'idle' ? -1 : 6
  );

  // Auto-pulse workflow when in hero interactive mode
  useEffect(() => {
    if (activeStep !== 'all' && activeStep !== 'idle') {
      const idx = WORKFLOW_NODES.findIndex((n) => n.id === activeStep);
      if (idx !== -1) setCurrentStepIdx(idx);
      return;
    }

    if (mode === 'hero' && activeStep === 'all') {
      const interval = setInterval(() => {
        setCurrentStepIdx((prev) => (prev + 1) % WORKFLOW_NODES.length);
      }, 2600);
      return () => clearInterval(interval);
    }
  }, [activeStep, mode]);

  // Determine if a node is activated
  const isNodeActive = (nodeId: WorkflowStepId) => {
    if (activeStep === 'all') return true;
    if (activeStep === 'idle') return false;
    const nodeIdx = WORKFLOW_NODES.findIndex((n) => n.id === nodeId);
    const targetIdx = WORKFLOW_NODES.findIndex((n) => n.id === activeStep);
    return targetIdx !== -1 ? nodeIdx <= targetIdx : nodeIdx <= currentStepIdx;
  };

  const isCurrentActive = (nodeId: WorkflowStepId) => {
    if (hoveredNode) return hoveredNode === nodeId;
    const nodeIdx = WORKFLOW_NODES.findIndex((n) => n.id === nodeId);
    return nodeIdx === currentStepIdx;
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 1. RIBBON MODE (Used for Command Center, Refill Queue, Analytics)
  // ──────────────────────────────────────────────────────────────────────────
  if (mode === 'ribbon') {
    return (
      <div
        className={`relative flex items-center justify-between gap-1 overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#03132F]/80 p-3 backdrop-blur-md ${className}`}
      >
        {/* Subtle Ambient Flow Line Behind Nodes */}
        <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-emerald-500/30" />

        {WORKFLOW_NODES.map((node, i) => {
          const active = isNodeActive(node.id);
          const current = isCurrentActive(node.id);
          const Icon = node.icon;

          return (
            <div key={node.id} className="relative z-10 flex items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`group flex flex-col items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 ${
                  interactive ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center rounded-xl transition-all duration-300 ${
                    node.id === 'ai'
                      ? 'size-9 border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.5)]'
                      : node.id === 'resolved'
                      ? 'size-8 border border-emerald-400/80 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : active
                      ? 'size-8 border border-cyan-500/40 bg-slate-900 text-cyan-400'
                      : 'size-8 border border-slate-700/60 bg-slate-950/60 text-slate-500'
                  } ${current ? 'ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-[#03132F]' : ''}`}
                >
                  <Icon className={node.id === 'ai' ? 'size-5' : 'size-4'} />
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
                    {node.label}
                  </span>
                  <span className="hidden sm:block text-[9px] text-slate-400">
                    {node.sub}
                  </span>
                </div>
              </button>

              {/* Connector Arrow */}
              {i < WORKFLOW_NODES.length - 1 && (
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
  // 2. NETWORK MODE (Hierarchical Diamond/Tree as requested)
  //
  //                      [Resolved]
  //                          ▲
  //                   [OushadhaSetu AI] (Largest)
  //                         /   \
  //               [Provider]     [Insurance]
  //                         \   /
  //                       [Pharmacy]
  //                          ▲
  //                     [Prescription]
  //                          ▲
  //                       [Patient]
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`relative mx-auto flex w-full max-w-[480px] flex-col items-center select-none py-4 ${className}`}
    >
      {/* Background Volumetric Cyan Radiance */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-80 rounded-full bg-cyan-500/10 blur-[80px]" />
      </div>

      {/* SVG Connecting Flow Lines between coordinates */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 400 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="netFlowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#087BFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
          </linearGradient>

          <filter id="netGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base Stream: Patient (200, 420) -> Prescription (200, 345) */}
        <path
          d="M 200 420 L 200 345"
          stroke="url(#netFlowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* 2. Prescription (200, 345) -> Pharmacy (200, 270) */}
        <path
          d="M 200 345 L 200 270"
          stroke="url(#netFlowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* 3. Pharmacy (200, 270) -> Provider (110, 185) */}
        <path
          d="M 200 270 C 180 240, 130 220, 110 185"
          stroke="url(#netFlowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* 4. Pharmacy (200, 270) -> Insurance (290, 185) */}
        <path
          d="M 200 270 C 220 240, 270 220, 290 185"
          stroke="url(#netFlowGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* 5. Provider (110, 185) -> AI (200, 95) */}
        <path
          d="M 110 185 C 130 150, 180 130, 200 95"
          stroke="url(#netFlowGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* 6. Insurance (290, 185) -> AI (200, 95) */}
        <path
          d="M 290 185 C 270 150, 220 130, 200 95"
          stroke="url(#netFlowGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* 7. AI (200, 95) -> Resolved (200, 25) */}
        <path
          d="M 200 95 L 200 25"
          stroke="#10B981"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#netGlow)"
        />

        {/* Animated Rapid Travelling Packets along flow */}
        <motion.path
          d="M 200 420 L 200 345 L 200 270 C 180 240, 130 220, 110 185 C 130 150, 180 130, 200 95 L 200 25"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeDasharray="10 35"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -180] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        <motion.path
          d="M 200 270 C 220 240, 270 220, 290 185 C 270 150, 220 130, 200 95"
          stroke="#00D9FF"
          strokeWidth="2.5"
          strokeDasharray="8 30"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -140] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
      </svg>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* NODE HIERARCHY LAYOUT CONTAINER                                  */}
      {/* ──────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col items-center">
        {/* LEVEL 1: REFILL RESOLVED (Top Beacon) */}
        <div className="mb-4">
          <WorkflowNodeItem
            node={WORKFLOW_NODES[6]}
            isActive={isNodeActive('resolved')}
            isCurrent={isCurrentActive('resolved')}
            onClick={() => onStepClick?.('resolved')}
            onHover={setHoveredNode}
          />
        </div>

        {/* LEVEL 2: OUSHADHASETU AI (Largest Core Node) */}
        <div className="mb-7">
          <WorkflowNodeItem
            node={WORKFLOW_NODES[5]}
            isActive={isNodeActive('ai')}
            isCurrent={isCurrentActive('ai')}
            onClick={() => onStepClick?.('ai')}
            onHover={setHoveredNode}
          />
        </div>

        {/* LEVEL 3: PROVIDER (Left) & INSURANCE (Right) */}
        <div className="mb-7 flex w-full max-w-[340px] items-center justify-between px-4">
          <WorkflowNodeItem
            node={WORKFLOW_NODES[3]}
            isActive={isNodeActive('provider')}
            isCurrent={isCurrentActive('provider')}
            onClick={() => onStepClick?.('provider')}
            onHover={setHoveredNode}
          />
          <WorkflowNodeItem
            node={WORKFLOW_NODES[4]}
            isActive={isNodeActive('insurance')}
            isCurrent={isCurrentActive('insurance')}
            onClick={() => onStepClick?.('insurance')}
            onHover={setHoveredNode}
          />
        </div>

        {/* LEVEL 4: PHARMACY */}
        <div className="mb-6">
          <WorkflowNodeItem
            node={WORKFLOW_NODES[2]}
            isActive={isNodeActive('pharmacy')}
            isCurrent={isCurrentActive('pharmacy')}
            onClick={() => onStepClick?.('pharmacy')}
            onHover={setHoveredNode}
          />
        </div>

        {/* LEVEL 5: PRESCRIPTION */}
        <div className="mb-6">
          <WorkflowNodeItem
            node={WORKFLOW_NODES[1]}
            isActive={isNodeActive('prescription')}
            isCurrent={isCurrentActive('prescription')}
            onClick={() => onStepClick?.('prescription')}
            onHover={setHoveredNode}
          />
        </div>

        {/* LEVEL 6: PATIENT (Origin Node) */}
        <div>
          <WorkflowNodeItem
            node={WORKFLOW_NODES[0]}
            isActive={isNodeActive('patient')}
            isCurrent={isCurrentActive('patient')}
            onClick={() => onStepClick?.('patient')}
            onHover={setHoveredNode}
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Individual Node Item Renderer
// ────────────────────────────────────────────────────────────────────────────
interface WorkflowNodeItemProps {
  node: WorkflowNode;
  isActive: boolean;
  isCurrent: boolean;
  onClick?: () => void;
  onHover?: (id: WorkflowStepId | null) => void;
}

function WorkflowNodeItem({
  node,
  isActive,
  isCurrent,
  onClick,
  onHover,
}: WorkflowNodeItemProps) {
  const Icon = node.icon;

  const sizeClasses = {
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-14',
    xl: 'size-18 sm:size-20', // AI node is largest
  };

  const iconSizes = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-9',
  };

  const isAi = node.id === 'ai';
  const isResolved = node.id === 'resolved';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover?.(node.id)}
      onMouseLeave={() => onHover?.(null)}
      animate={
        isCurrent
          ? { scale: [1, 1.08, 1.04] }
          : isActive
          ? { scale: 1 }
          : { scale: 0.94 }
      }
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
    >
      {/* Concentric Pulse Rings for AI Node */}
      {isAi && isActive && (
        <>
          <span className="pointer-events-none absolute -inset-3 rounded-full border border-cyan-400/40 animate-ping opacity-35" />
          <span className="pointer-events-none absolute -inset-6 rounded-full border border-cyan-400/20 animate-pulse" />
        </>
      )}

      {/* Node Circle Visual */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-400 ${
          sizeClasses[node.size]
        } ${
          isAi
            ? 'border-2 border-cyan-300 bg-gradient-to-tr from-[#06245A] via-[#087BFF] to-[#00D9FF] text-white shadow-[0_0_30px_rgba(0,217,255,0.7)]'
            : isResolved
            ? 'border-2 border-emerald-400 bg-gradient-to-tr from-slate-900 to-emerald-950 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.6)]'
            : isActive
            ? 'border border-cyan-400/80 bg-[#06245A] text-cyan-300 shadow-[0_0_16px_rgba(0,217,255,0.4)]'
            : 'border border-slate-700/60 bg-slate-900/80 text-slate-500'
        } ${
          isCurrent
            ? 'ring-4 ring-cyan-400/40 ring-offset-2 ring-offset-[#020B18]'
            : ''
        }`}
      >
        <Icon className={`${iconSizes[node.size]} transition-transform duration-200 group-hover:scale-110`} />

        {/* Small Active Sparkle indicator for AI */}
        {isAi && (
          <Sparkles className="absolute -top-1 -right-1 size-4 text-cyan-300 animate-spin [animation-duration:6s]" />
        )}
      </div>

      {/* Label and Micro-Telemetry */}
      <div className="mt-1 text-center">
        <span
          className={`block font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors ${
            isAi
              ? 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]'
              : isResolved
              ? 'text-emerald-400 font-bold'
              : isActive
              ? 'text-slate-200'
              : 'text-slate-500'
          }`}
        >
          {node.label}
        </span>
        <span className="block font-mono text-[9px] text-slate-400">
          {node.actionText || node.sub}
        </span>
      </div>
    </motion.button>
  );
}
