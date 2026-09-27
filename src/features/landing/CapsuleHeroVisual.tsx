import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles } from 'lucide-react';

const AI_STATUS_STEPS = [
  { text: 'Analyzing refill...', status: 'INTAKE', icon: 'telemetry' },
  { text: 'Checking blocker...', status: 'AUDIT', icon: 'blocker' },
  { text: 'Identifying responsible party...', status: 'ROUTING', icon: 'party' },
  { text: 'Finding next action...', status: 'PREPARE', icon: 'action' },
  { text: 'Flow restored ✓', status: 'RESOLVED', icon: 'done' },
];

export function CapsuleHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle physical parallax (NOT spinning or erratic)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 80 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  // Natural slow AI status cycling (4.2 seconds each)
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % AI_STATUS_STEPS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Water-Flow Animation: Small number of organic, calm liquid particles (18 total)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    // Natural particles flowing through curved paths
    interface WaterParticle {
      t: number; // 0 to 1
      speed: number;
      size: number;
      track: number;
      opacity: number;
    }

    // Only 18 particles for an elegant, calm, non-cluttered look
    const particles: WaterParticle[] = Array.from({ length: 18 }, (_, i) => ({
      t: i / 18,
      speed: 0.0018 + (i % 3) * 0.0006, // subtle speed variation
      size: 2.0 + (i % 2) * 1.0,
      track: i % 2,
      opacity: 0.5 + (i % 3) * 0.2,
    }));

    // Two graceful orbital tracks around the capsule
    const getTrackPoint = (track: number, t: number) => {
      const cx = width * 0.5;
      const cy = height * 0.5;

      if (track === 0) {
        // Outer gentle elliptical flow
        const angle = t * Math.PI * 2;
        const rx = width * 0.42;
        const ry = height * 0.32;
        return {
          x: cx + Math.cos(angle) * rx,
          y: cy + Math.sin(angle) * ry,
        };
      } else {
        // Inclined water loop
        const angle = t * Math.PI * 2 + Math.PI / 6;
        const rx = width * 0.36;
        const ry = height * 0.38;
        return {
          x: cx + Math.cos(angle) * rx,
          y: cy + Math.sin(angle) * ry + Math.sin(t * Math.PI * 2) * 12,
        };
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle transparent guide stream lines
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const pt = getTrackPoint(0, i / 64);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const pt = getTrackPoint(1, i / 64);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(34, 199, 214, 0.09)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Animate water particles with natural easing & fluid trails
      particles.forEach((p) => {
        p.t = (p.t + p.speed) % 1;
        const pos = getTrackPoint(p.track, p.t);
        const trailPos = getTrackPoint(p.track, Math.max(0, p.t - 0.04));

        // Soft fluid trail
        const grad = ctx.createLinearGradient(trailPos.x, trailPos.y, pos.x, pos.y);
        grad.addColorStop(0, 'rgba(34, 199, 214, 0)');
        grad.addColorStop(1, `rgba(34, 199, 214, ${p.opacity})`);

        ctx.beginPath();
        ctx.moveTo(trailPos.x, trailPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Droplet head
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 250, 248, ${p.opacity * 1.1})`;
        ctx.shadowColor = 'rgba(20, 184, 166, 0.5)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const activeStatus = AI_STATUS_STEPS[stepIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] lg:max-w-[580px] aspect-square mx-auto flex items-center justify-center select-none"
    >
      {/* Background Soft Glow (Deep Navy / Subtle Teal) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-[320px] rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="size-[220px] rounded-full bg-cyan-400/15 blur-[80px]" />
      </div>

      {/* Water-Flow Canvas Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Main Capsule Visual: Subtle Physical Parallax & Gentle Organic Float */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-20 flex items-center justify-center w-[74%] h-[74%]"
      >
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotateZ: [-2, 2, -2],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Subtle Depth Shadow */}
          <div className="absolute inset-10 rounded-full bg-cyan-950/40 blur-2xl pointer-events-none" />

          {/* Central Blue/Cyan Medical Capsule Image */}
          <img
            src="/images/capsule-hero.png"
            alt="OushadhaSetu Intelligent Medication Refill Capsule"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(7,17,31,0.9)]"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* 1. Live Refill Flow Indicator (Top Left - Real Product UI feel) */}
      <div className="absolute top-2 left-2 sm:top-6 sm:left-4 z-30 bg-[#0B1726]/90 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md max-w-[230px]">
        <div className="flex items-center justify-between text-[10.5px] font-mono font-semibold tracking-wider text-teal-400 uppercase">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
            Live Refill Flow
          </span>
          <span className="text-slate-400 text-[9.5px]">RX-8042</span>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/10 text-xs">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Current State</div>
          <div className="font-semibold text-slate-100 mt-0.5 leading-snug">
            Provider Approval Required
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
          <span className="text-slate-400">Risk:</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
            HIGH
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-white/10 text-[10.5px] text-slate-300">
          <span className="text-slate-400 font-mono text-[9.5px] uppercase block">Next Action</span>
          <span className="text-cyan-300 font-medium">Request provider approval</span>
        </div>
      </div>

      {/* 2. AI Status Monitor (Bottom Right - Slow, purposeful transitions) */}
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
    </div>
  );
}
