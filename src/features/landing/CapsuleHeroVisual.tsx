import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const AI_STATUS_STEPS = [
  { text: 'Analyzing refill...', status: 'INTAKE' },
  { text: 'Checking blocker...', status: 'AUDIT' },
  { text: 'Identifying responsible party...', status: 'ROUTING' },
  { text: 'Finding next action...', status: 'PREPARE' },
  { text: 'Flow restored ✓', status: 'RESOLVED' },
];

const GRANULES = Array.from({ length: 26 }, (_, index) => ({
  left: 15 + ((index * 17) % 70),
  top: 18 + ((index * 23) % 52),
  size: 4 + (index % 5),
  opacity: 0.45 + (index % 4) * 0.16,
  delay: (index * 0.18) % 1.5,
  duration: 2.2 + (index % 5) * 0.5,
  drift: -18 + (index % 7) * 7,
  hue: index % 3 === 0 ? '#ff5d77' : index % 3 === 1 ? '#4adeff' : '#4f9bff',
}));

const FLOW_PATHS = [
  'M 18 64 C 46 32, 90 44, 120 72 S 180 110, 222 92',
  'M 42 110 C 88 88, 140 96, 172 68 S 230 44, 270 80',
  'M 64 142 C 116 124, 158 128, 188 108 S 250 78, 298 120',
];

export function CapsuleHeroVisual() {
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % AI_STATUS_STEPS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const activeStatus = AI_STATUS_STEPS[stepIndex];

  return (
    <>
      <style>{`
        @keyframes capsuleFill {
          0%, 10% { opacity: 0.15; transform: scaleY(0.68) translateY(12%); }
          18%, 38% { opacity: 0.7; transform: scaleY(0.92) translateY(6%); }
          46%, 64% { opacity: 1; transform: scaleY(1.04) translateY(0%); }
          72%, 82% { opacity: 1; transform: scaleY(1.14) translateY(-2%); }
          88%, 100% { opacity: 0.7; transform: scaleY(0.9) translateY(7%); }
        }

        @keyframes particleDrift {
          0% {
            transform: translate3d(0, -8px, 0) scale(0.86);
            opacity: 0.2;
          }
          14% {
            opacity: 0.95;
          }
          55% {
            transform: translate3d(var(--drift), 28px, 0) scale(1.12);
            opacity: 1;
          }
          100% {
            transform: translate3d(calc(var(--drift) * 1.25), 56px, 0) scale(0.9);
            opacity: 0.15;
          }
        }

        @keyframes sealGlow {
          0%, 52% { opacity: 0; }
          68%, 80% { opacity: 0.9; }
          100% { opacity: 0.45; }
        }

        @keyframes flowPulse {
          0%, 100% { opacity: 0.2; }
          30%, 70% { opacity: 1; }
        }

        @keyframes orbitDot {
          0% { transform: translate(-12px, -24px) scale(0.7); opacity: 0; }
          18% { opacity: 1; }
          60% { transform: translate(18px, 8px) scale(1); opacity: 1; }
          100% { transform: translate(32px, 30px) scale(0.8); opacity: 0; }
        }

        .capsule-stage {
          position: relative;
          width: min(78vw, 560px);
          height: min(46vw, 360px);
          max-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .capsule-flow {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.65;
        }

        .capsule-flow path {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.2;
          stroke: rgba(94, 234, 212, 0.65);
          filter: drop-shadow(0 0 12px rgba(45, 212, 191, 0.2));
          animation: flowPulse 4.8s ease-in-out infinite;
        }

        .capsule-flow path:nth-child(2) { animation-delay: 0.6s; }
        .capsule-flow path:nth-child(3) { animation-delay: 1.1s; }

        .capsule-network-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: rgba(125, 211, 252, 0.95);
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.8);
          animation: orbitDot 4.3s ease-in-out infinite;
        }

        .capsule-shell {
          position: relative;
          width: 75%;
          max-width: 500px;
          aspect-ratio: 2.15 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          filter: drop-shadow(0 38px 52px rgba(6, 12, 24, 0.8));
        }

        .capsule-shadow {
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: -22px;
          height: 48px;
          border-radius: 9999px;
          background: radial-gradient(ellipse at center, rgba(34, 211, 238, 0.22), rgba(15, 23, 42, 0));
          filter: blur(18px);
          transform: translateY(12px) scaleX(1.08);
          animation: shadowShift 7.2s ease-in-out infinite;
        }

        @keyframes shadowShift {
          0%, 16% { opacity: 0.32; transform: translateY(12px) scaleX(0.92); }
          38%, 58% { opacity: 0.7; transform: translateY(16px) scaleX(1.12); }
          74%, 100% { opacity: 0.38; transform: translateY(12px) scaleX(0.94); }
        }

        .capsule-visual {
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
          transform-style: preserve-3d;
        }

        .capsule-image {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 0 28px rgba(103, 232, 249, 0.24));
        }

        .capsule-fill-layer {
          position: absolute;
          z-index: 2;
          inset: 11% 11% 14% 11%;
          border-radius: 9999px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(56, 189, 248, 0.15), rgba(20, 184, 166, 0.28));
          border: 1.5px solid rgba(146, 230, 255, 0.25);
          box-shadow: inset 0 0 18px rgba(12, 227, 255, 0.22), inset 0 0 26px rgba(34, 211, 238, 0.12);
          animation: capsuleFill 7.2s ease-in-out infinite;
        }

        .capsule-fill-layer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 26%, rgba(5, 233, 255, 0.2) 52%, rgba(250,255,255,0.12) 72%, rgba(255,255,255,0.06));
          opacity: 0.9;
        }

        .capsule-granule {
          position: absolute;
          left: var(--left);
          top: var(--top);
          width: var(--size);
          height: var(--size);
          border-radius: 9999px;
          background: var(--hue);
          box-shadow: 0 0 10px color-mix(in srgb, var(--hue) 72%, white 28%);
          opacity: var(--opacity);
          animation: particleDrift var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .capsule-seam {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          border-radius: 9999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.72), rgba(255,255,255,0.1) 18%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.08));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), inset 0 0 18px rgba(255,255,255,0.18);
          mix-blend-mode: screen;
          animation: sealGlow 7.2s ease-in-out infinite;
        }

        .capsule-halo {
          position: absolute;
          inset: 12% 14% 10% 14%;
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 50%, rgba(103, 232, 249, 0.18), rgba(34, 211, 238, 0.04) 60%, transparent 80%);
          z-index: 1;
          filter: blur(14px);
          animation: sealGlow 7.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .capsule-fill-layer,
          .capsule-granule,
          .capsule-seam,
          .capsule-shadow,
          .capsule-flow path,
          .capsule-network-dot {
            animation: none !important;
          }
        }
      `}</style>

      <div className="capsule-stage">
        <svg className="capsule-flow" viewBox="0 0 320 180" aria-hidden="true">
          {FLOW_PATHS.map((path, index) => (
            <path key={path} d={path} style={{ animationDelay: `${index * 0.55}s` }} />
          ))}
        </svg>

        <span className="capsule-network-dot" style={{ left: '15%', top: '62%', animationDelay: '0.8s' }} />
        <span className="capsule-network-dot" style={{ left: '58%', top: '28%', animationDelay: '1.4s' }} />
        <span className="capsule-network-dot" style={{ left: '72%', top: '70%', animationDelay: '2.2s' }} />

        <motion.div
          className="capsule-shell"
          animate={reduceMotion ? { rotateX: 4, rotateY: -8, y: 0 } : { rotateX: [0, 5, 10, 8, 4, 0], rotateY: [-10, 4, 12, 8, -2, -6], y: [0, -4, 0, 2, 0, -2], x: [0, 4, 0, -2, 0, 2] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformPerspective: 1200 }}
        >
          <div className="capsule-shadow" />
          <div className="capsule-visual">
            <div className="capsule-halo" />
            <div className="capsule-fill-layer">
              {GRANULES.map((particle, index) => (
                <span
                  key={`${particle.left}-${particle.top}-${index}`}
                  className="capsule-granule"
                  style={
                    {
                      ['--left' as string]: `${particle.left}%`,
                      ['--top' as string]: `${particle.top}%`,
                      ['--size' as string]: `${particle.size}px`,
                      ['--delay' as string]: `${particle.delay}s`,
                      ['--duration' as string]: `${particle.duration}s`,
                      ['--drift' as string]: `${particle.drift}px`,
                      ['--hue' as string]: particle.hue,
                      ['--opacity' as string]: particle.opacity.toString(),
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="capsule-seam" />
            <img src="/images/capsule-hero.png" alt="Pharmaceutical capsule" className="capsule-image" draggable={false} />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-3 right-2 sm:bottom-6 sm:right-4 z-30 bg-[#0B1726]/90 border border-white/10 rounded-2xl p-3.5 shadow-xl backdrop-blur-md max-w-[240px]">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-teal-500/15 text-teal-300 flex items-center justify-center font-bold">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-200">Oushadha AI</div>
            <div className="text-[9.5px] text-teal-400 font-mono">Telemetry Active</div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/10">
          <div className="text-[11px] font-medium text-slate-100 leading-snug min-h-[32px] flex items-center">
            {activeStatus.text}
          </div>
          <div className="mt-1 text-[9px] font-mono text-slate-400 flex items-center justify-between">
            <span>Cycle Protocol:</span>
            <span className="text-cyan-300 font-semibold">{activeStatus.status}</span>
          </div>
        </div>
      </div>
    </>
  );
}
