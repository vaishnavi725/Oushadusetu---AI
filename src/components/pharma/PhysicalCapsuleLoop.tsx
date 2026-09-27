import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface PhysicalCapsuleLoopProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWorkflowStream?: boolean;
  showTelemetryHUD?: boolean;
  onStreamEmit?: () => void;
}

// Particle state for medicine granules
interface Granule {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  settled: boolean;
  alpha: number;
  bounceCount: number;
}

export type CapsuleLoopPhase =
  | 'closed'
  | 'rotate_prep'
  | 'opening'
  | 'filling'
  | 'full'
  | 'closing'
  | 'rotating'
  | 'pause';

export function PhysicalCapsuleLoop({
  className = '',
  size = 'md',
  showWorkflowStream = true,
  showTelemetryHUD = true,
  onStreamEmit,
}: PhysicalCapsuleLoopProps) {
  // ──────────────────────────────────────────────────────────────────────────
  // Continuous 8.8-second loop timeline:
  // Step 1: 0.0s – 1.4s : CLOSED (Complete capsule, subtle floating breath)
  // Step 2: 1.4s – 2.0s : ROTATE_PREP (Tilts into 3D viewing angle)
  // Step 3: 2.0s – 3.4s : OPENING (Top half physically separates & lifts 80px + backward tilt)
  // Step 4: 3.4s – 5.2s : FILLING (Medicine particles flow from above, bounce & stack)
  // Step 5: 5.2s – 6.2s : FULL (Chamber filled, particles settle, brief calm pause)
  // Step 6: 6.2s – 7.2s : CLOSING (Top half glides down, snaps shut, seam flash triggers)
  // Step 7: 7.2s – 8.4s : ROTATING (Closed capsule rotates in 3D, cyan stream emerges)
  // Step 8: 8.4s – 8.8s : PAUSE & Seamlessly loops back to Step 1 / Step 2
  // ──────────────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<CapsuleLoopPhase>('closed');
  const [loopCycle, setLoopCycle] = useState(1);
  const [fillPct, setFillPct] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scaled dimensions
  const dims = {
    sm: { width: 145, capHeight: 120, bodyHeight: 130, openGap: 66, lipH: 14 },
    md: { width: 175, capHeight: 145, bodyHeight: 155, openGap: 80, lipH: 16 },
    lg: { width: 210, capHeight: 175, bodyHeight: 185, openGap: 96, lipH: 18 },
  }[size];

  // Total height of the visual stage to allow particles falling in through the open gap
  const stageHeight = dims.capHeight + dims.openGap + dims.bodyHeight + 40;

  // ──────────────────────────────────────────────────────────────────────────
  // MASTER TIMELINE LOOP (Continuous 8.8s cycle)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // 0.0s: Step 1 - Closed
    setPhase('closed');
    setFillPct(0);

    // 1.4s: Step 2 - Rotate into viewing position
    const t1 = setTimeout(() => {
      if (!cancelled) setPhase('rotate_prep');
    }, 1400);

    // 2.0s: Step 3 - Open physically
    const t2 = setTimeout(() => {
      if (!cancelled) setPhase('opening');
    }, 2000);

    // 3.4s: Step 4 - Medicine enters & fills
    const t3 = setTimeout(() => {
      if (!cancelled) setPhase('filling');
    }, 3400);

    // 5.2s: Step 5 - Full & settled
    const t4 = setTimeout(() => {
      if (!cancelled) {
        setPhase('full');
        setFillPct(100);
      }
    }, 5200);

    // 6.2s: Step 6 - Close & seam highlight
    const t5 = setTimeout(() => {
      if (!cancelled) setPhase('closing');
    }, 6200);

    // 7.2s: Step 7 - Rotate & emit stream
    const t6 = setTimeout(() => {
      if (!cancelled) {
        setPhase('rotating');
        onStreamEmit?.();
      }
    }, 7200);

    // 8.4s: Step 8 - Pause & loop
    const t7 = setTimeout(() => {
      if (!cancelled) setPhase('pause');
    }, 8400);

    // 8.8s: Restart next loop seamlessly
    const t8 = setTimeout(() => {
      if (!cancelled) {
        setLoopCycle((c) => c + 1);
      }
    }, 8800);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  }, [loopCycle, onStreamEmit]);

  // ──────────────────────────────────────────────────────────────────────────
  // REALISTIC MEDICINE GRANULES PHYSICS ENGINE (Gravity, collisions & stacking)
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = dims.width + 80);
    const height = (canvas.height = stageHeight);

    // Reference horizontal boundaries relative to canvas center
    const centerX = width / 2;
    const halfW = dims.width / 2;
    const leftLimit = centerX - halfW + 14;
    const rightLimit = centerX + halfW - 14;

    // Body baseline: where the bottom half sits in this stage
    const bodyTop = dims.capHeight + dims.openGap;
    const bodyBottom = bodyTop + dims.bodyHeight - 16;

    const granules: Granule[] = [];
    const colors = ['#00D9FF', '#087BFF', '#FFFFFF', '#74D7FF', '#38BDF8'];

    let spawned = 0;
    const targetMax = 52;
    const gravity = 0.26;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Continuous natural spawning when in filling phase
      if (phase === 'filling' && spawned < targetMax) {
        // Stream in 1-2 particles per frame naturally
        if (Math.random() > 0.15) {
          granules.push({
            id: spawned++,
            x: centerX + (Math.random() - 0.5) * (dims.width * 0.48),
            // Spawn in the open gap region between cap and body
            y: dims.capHeight - 20 - Math.random() * 35,
            vx: (Math.random() - 0.5) * 1.4,
            vy: 1.8 + Math.random() * 2.4, // Varying initial speeds
            radius: Math.random() * 2.8 + 2.0,
            color: colors[Math.floor(Math.random() * colors.length)],
            settled: false,
            alpha: 0.95,
            bounceCount: 0,
          });

          // Update fill percentage metric
          setFillPct(Math.min(100, Math.round((spawned / targetMax) * 100)));
        }
      }

      // Physics update & render
      for (let i = 0; i < granules.length; i++) {
        const g = granules[i];

        if (!g.settled) {
          g.vy += gravity;
          g.x += g.vx;
          g.y += g.vy;

          // Wall collision with restitution damping
          if (g.x < leftLimit) {
            g.x = leftLimit;
            g.vx = -g.vx * 0.38;
          }
          if (g.x > rightLimit) {
            g.x = rightLimit;
            g.vx = -g.vx * 0.38;
          }

          // Dynamic bottom settling floor (stacks upward as particles accumulate)
          const pileLevel = bodyBottom - (i * 0.65);
          if (g.y >= pileLevel) {
            g.y = pileLevel;
            g.vy = -g.vy * 0.24; // Subtle realistic pharmaceutical granule bounce
            g.vx *= 0.45;
            g.bounceCount++;

            if (Math.abs(g.vy) < 0.35 || g.bounceCount > 2) {
              g.settled = true;
              g.vy = 0;
              g.vx = 0;
            }
          }
        }

        // Draw particle with realistic volumetric glow
        ctx.save();
        ctx.globalAlpha = g.alpha;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = g.color;
        ctx.shadowColor = g.color;
        ctx.shadowBlur = 7;
        ctx.fill();

        // Inner white specular pinhead
        if (g.radius > 2.4) {
          ctx.beginPath();
          ctx.arc(g.x - g.radius * 0.3, g.y - g.radius * 0.3, g.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
        ctx.restore();
      }

      // In pause / reset phase, gracefully clear particles for next cycle
      if (phase === 'pause' || phase === 'closed') {
        granules.forEach((g) => {
          g.alpha *= 0.92;
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase, dims.width, dims.capHeight, dims.bodyHeight, dims.openGap, stageHeight, loopCycle]);

  // Visual state flags
  const isOpen = phase === 'opening' || phase === 'filling' || phase === 'full';
  const isClosing = phase === 'closing';
  const isRotating = phase === 'rotating';
  const isRotatePrep = phase === 'rotate_prep';

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* ────────────────────────────────────────────────────────────── */}
      {/* 1. AMBIENT BIOLUMINESCENT GLOWS                                */}
      {/* ────────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-cyan-400/20 blur-3xl opacity-70 animate-pulse" />
      <div className="pointer-events-none absolute -inset-20 rounded-full bg-blue-600/15 blur-3xl opacity-50" />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* 2. 3D CAPSULE RIG (Gentle tilt, rotation & lighting shifts)   */}
      {/* ────────────────────────────────────────────────────────────── */}
      <motion.div
        animate={
          isRotating
            ? {
                rotateY: [0, 22, -14, 0],
                rotateX: [0, -10, 8, 0],
                rotateZ: [-12, -6, -16, -12],
                scale: [1, 1.03, 1],
              }
            : isRotatePrep
            ? {
                rotateY: 8,
                rotateX: 6,
                rotateZ: -10,
                scale: 1.01,
              }
            : isOpen
            ? {
                rotateY: 6,
                rotateX: 4,
                rotateZ: -8,
                scale: 1,
              }
            : {
                rotateY: [-3, 3, -3],
                rotateX: [2, -2, 2],
                rotateZ: -12,
                scale: 1,
              }
        }
        transition={{
          duration: isRotating ? 1.4 : isRotatePrep ? 0.6 : isOpen ? 1.2 : 3.8,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center"
        style={{
          width: dims.width,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ============================================================ */}
        {/* TOP HALF: Physically Separating Transparent Glass Cap       */}
        {/* ============================================================ */}
        <motion.div
          animate={
            isOpen
              ? {
                  y: -dims.openGap, // Moves 80px physically upward
                  rotateX: -12, // Slight backward tilt as requested
                  rotateZ: 2,
                }
              : isClosing
              ? {
                  y: [-dims.openGap, 4, 0], // Smooth spring close with micro settling
                  rotateX: 0,
                  rotateZ: 0,
                }
              : {
                  y: 0,
                  rotateX: 0,
                  rotateZ: 0,
                }
          }
          transition={{
            duration: isOpen ? 1.4 : isClosing ? 0.85 : 0.6,
            ease: [0.22, 1, 0.36, 1], // Realistic spring physics, NO linear movement
          }}
          className="relative z-30 w-full overflow-hidden"
          style={{
            height: dims.capHeight,
            borderTopLeftRadius: dims.width / 2,
            borderTopRightRadius: dims.width / 2,
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.34) 0%, rgba(77, 163, 255, 0.12) 35%, rgba(6, 36, 90, 0.42) 100%)',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            borderBottom: 'none',
            boxShadow:
              'inset 0 4px 28px rgba(255, 255, 255, 0.45), inset -5px 0 16px rgba(0, 217, 255, 0.3), 0 -8px 30px rgba(0, 217, 255, 0.25)',
            backdropFilter: 'blur(3.5px)',
          }}
        >
          {/* Specular Left Highlight Streak */}
          <div
            className="absolute top-4 left-3 w-2.5 rounded-full pointer-events-none opacity-85"
            style={{
              height: dims.capHeight * 0.72,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Dome Specular Highlight */}
          <div
            className="absolute top-2 inset-x-8 h-4 rounded-full pointer-events-none opacity-80"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, transparent 75%)',
            }}
          />

          {/* Inner Glowing Cyan Neural Constellation (Matches Reference Image) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
            <div className="size-20 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
            <div className="absolute size-1.5 rounded-full bg-cyan-300 top-12 left-10 shadow-[0_0_8px_#00D9FF]" />
            <div className="absolute size-2 rounded-full bg-white top-16 right-12 shadow-[0_0_10px_#FFFFFF]" />
            <div className="absolute size-1.5 rounded-full bg-cyan-400 bottom-10 left-16 shadow-[0_0_8px_#00D9FF]" />
          </div>

          {/* Laser-Engraved Pharmaceutical Typography */}
          <div className="absolute bottom-6 inset-x-3 text-right pr-2 font-mono select-none pointer-events-none">
            <div className="text-[8.5px] sm:text-[9.5px] font-bold tracking-wider text-cyan-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              MED-TEK 3D · LUMIN-9
            </div>
            <div className="text-[7.5px] sm:text-[8px] tracking-widest text-slate-300">
              DOSE 100mg · REFILL-SYNC
            </div>
          </div>

          {/* Titanium Joint Collar Lip (Bottom edge of Cap) */}
          <div
            className="absolute bottom-0 inset-x-0 h-3.5 z-30"
            style={{
              background:
                'linear-gradient(90deg, rgba(148, 163, 184, 0.9) 0%, rgba(255, 255, 255, 0.98) 50%, rgba(100, 116, 139, 0.9) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
            }}
          />
        </motion.div>

        {/* ============================================================ */}
        {/* SEAM GAP: Laser Highlight Flash when contact is made         */}
        {/* ============================================================ */}
        <div className="relative w-full h-0 flex items-center justify-center z-40">
          {/* Laser Flash Flare on snap-shut */}
          <motion.div
            animate={
              isClosing
                ? {
                    opacity: [0, 1, 0],
                    scaleX: [0.6, 1.4, 0.9],
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute -top-1 inset-x-0 h-2 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#00D9FF,0_0_35px_#FFFFFF] pointer-events-none"
          />

          {/* Open Atmosphere Light Influx when separated */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.85, scaleY: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-12 w-3 h-20 bg-gradient-to-b from-cyan-300/35 via-blue-500/20 to-transparent blur-sm pointer-events-none"
            />
          )}
        </div>

        {/* ============================================================ */}
        {/* BOTTOM HALF: Illuminated Bioluminescent Base Chamber        */}
        {/* ============================================================ */}
        <div
          className="relative z-10 w-full overflow-hidden"
          style={{
            height: dims.bodyHeight,
            borderBottomLeftRadius: dims.width / 2,
            borderBottomRightRadius: dims.width / 2,
            background:
              'linear-gradient(180deg, rgba(6, 36, 90, 0.9) 0%, rgba(3, 19, 47, 0.98) 45%, rgba(0, 217, 255, 0.48) 100%)',
            border: '2px solid rgba(0, 217, 255, 0.92)',
            borderTop: 'none',
            boxShadow:
              'inset 0 0 38px rgba(0, 217, 255, 0.52), 0 14px 50px rgba(0, 217, 255, 0.45)',
          }}
        >
          {/* Open 3D Mouth Ellipse (Exposed when upper cap separates) */}
          <div
            className="absolute top-0 inset-x-0 h-4 z-30"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0, 217, 255, 0.85) 0%, rgba(3, 19, 47, 0.98) 70%, rgba(0, 217, 255, 0.95) 100%)',
              borderBottom: '1px solid rgba(0, 217, 255, 0.8)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="flex items-center justify-between px-3 h-full">
              <span className="font-mono text-[7px] text-cyan-300 uppercase tracking-widest font-bold">
                OUSHADHA-CHAMBER
              </span>
              <div className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>

          {/* Bioluminescent Pool Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-cyan-500/40 via-blue-600/20 to-transparent pointer-events-none" />

          {/* Glass Rim Specular Streak on Right */}
          <div
            className="absolute bottom-6 right-3 w-2.5 rounded-full pointer-events-none opacity-60"
            style={{
              height: dims.bodyHeight * 0.68,
              background:
                'linear-gradient(0deg, rgba(0,217,255,0.75) 0%, rgba(255,255,255,0.35) 100%)',
              filter: 'blur(1px)',
            }}
          />

          {/* Holographic Heart Visual in Lower Core */}
          <motion.div
            animate={{
              scale: phase === 'full' ? [1, 1.15, 1.08] : [1, 1.06, 1],
              filter:
                phase === 'full'
                  ? 'drop-shadow(0 0 24px rgba(0, 217, 255, 1))'
                  : 'drop-shadow(0 0 12px rgba(0, 217, 255, 0.6))',
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15"
          >
            <Heart className="size-11 text-cyan-300 fill-cyan-400/25 stroke-[1.5]" />
          </motion.div>

          {/* Bottom Chamber Telemetry Label */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center opacity-50">
            <span className="font-mono text-[8px] text-cyan-200 tracking-widest uppercase">
              REFILL CAPACITY: {fillPct}%
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. PARTICLES CANVAS (Spanning the Open Gap + Lower Chamber)  */}
        {/* ============================================================ */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute top-0 -left-10 z-25 h-full w-[calc(100%+80px)]"
          style={{ height: stageHeight }}
        />

        {/* ============================================================ */}
        {/* 4. EMERGING CYAN REFILL STREAM (On Rotation / Close)         */}
        {/* ============================================================ */}
        {showWorkflowStream && (
          <motion.div
            animate={
              isRotating
                ? {
                    opacity: [0, 1, 0.9],
                    scale: [0.85, 1.1, 1],
                    x: [0, 15, 10],
                  }
                : { opacity: 0, x: 0 }
            }
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2"
          >
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 via-cyan-300 to-transparent shadow-[0_0_15px_#00D9FF]" />
            <span className="font-mono text-[9px] text-cyan-300 uppercase tracking-widest font-bold drop-shadow-[0_0_8px_#00D9FF] whitespace-nowrap">
              Refill Stream Active →
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* 5. TELEMETRY STATUS HUD (Clearly shows OPEN -> FILL -> CLOSE)  */}
      {/* ────────────────────────────────────────────────────────────── */}
      {showTelemetryHUD && (
        <div className="mt-4 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-950/80 px-3.5 py-1 backdrop-blur-md shadow-md">
          <div
            className={`size-2 rounded-full transition-colors duration-300 ${
              isOpen
                ? 'bg-amber-400 shadow-[0_0_8px_#FBBF24] animate-ping'
                : isRotating
                ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                : 'bg-cyan-400 shadow-[0_0_8px_#00D9FF]'
            }`}
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
            {phase === 'closed'
              ? 'Step 1: Capsule Sealed'
              : phase === 'rotate_prep'
              ? 'Step 2: 3D Tilting'
              : phase === 'opening'
              ? 'Step 3: Physically Opening'
              : phase === 'filling'
              ? `Step 4: Medicine Entering (${fillPct}%)`
              : phase === 'full'
              ? 'Step 5: Chamber Full'
              : phase === 'closing'
              ? 'Step 6: Sealing Chamber'
              : phase === 'rotating'
              ? 'Step 7: 3D Flow Dispatched'
              : 'Step 8: Cycle Ready'}
          </span>
          <span className="font-mono text-[9px] text-slate-400">· Loop #{loopCycle}</span>
        </div>
      )}
    </div>
  );
}
