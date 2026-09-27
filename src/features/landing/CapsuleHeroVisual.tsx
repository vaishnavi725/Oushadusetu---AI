import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Play, Pause, Activity, ShieldCheck, RotateCcw } from 'lucide-react';
import { REFILL_SCENES } from './refill-scenes';
import { RefillWorkflowVisual } from '@/components/pharma';

export function CapsuleHeroVisual() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'capsule' | 'workflow'>('capsule');
  const [progress, setProgress] = useState(24);
  const [activeSceneIdx, setActiveSceneIdx] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { damping: 24, stiffness: 140 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-9, 9]), { damping: 24, stiffness: 140 });

  const activeScene = REFILL_SCENES[activeSceneIdx];

  // Scrubber / Progress loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSceneIdx((s) => (s + 1) % REFILL_SCENES.length);
          return 0;
        }
        return prev + 0.4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Particle flow animation in background of capsule
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 540);
    let height = (canvas.height = 420);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8 + 0.4,
        vy: (Math.random() - 0.5) * 0.8 - 0.3,
        radius: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        hue: Math.random() > 0.5 ? 175 : 195, // Teal & Cyan
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting neural grid
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p1.hue}, 85%, 65%, ${p1.alpha * (isPlaying ? 1 : 0.4)})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(13, 148, 136, ${(1 - dist / 75) * 0.25})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const formatTime = (pct: number) => {
    const totalSecs = 120; // 2 min loop
    const curSecs = Math.floor((pct / 100) * totalSecs);
    const m = Math.floor(curSecs / 60);
    const s = curSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[560px] select-none"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Bioluminescent Backlight Glows */}
      <div className="pointer-events-none absolute -left-10 -top-8 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-8 -bottom-6 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-amber-200/20 blur-2xl" />

      {/* 3D Tilted Cinematic Video Player Container */}
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="relative overflow-hidden rounded-[32px] border border-[#EDE4D8] bg-slate-950 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.45)]"
      >
        {/* Top Video Header Bar */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              {isPlaying && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              4K Telemetry Loop
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">
              · 60 FPS Digital Twin
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Capsule vs Workflow */}
            <div className="flex items-center rounded-lg bg-black/40 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('capsule')}
                className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-medium transition-colors ${
                  viewMode === 'capsule'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Capsule
              </button>
              <button
                type="button"
                onClick={() => setViewMode('workflow')}
                className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-medium transition-colors ${
                  viewMode === 'workflow'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Workflow
              </button>
            </div>

            <span className="hidden sm:inline-block rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] font-medium text-teal-300 border border-teal-500/30">
              RX-{activeScene.id.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isPlaying ? 'Pause simulation' : 'Play simulation'}
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* Video Viewport: 3D Capsule Visual OR Refill Workflow Network */}
        <div className="relative flex h-[360px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0A161E]">
          {/* Canvas Neural Particle Stream */}
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80" />

          {/* Glowing Radial Spotlight */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-64 rounded-full bg-gradient-to-tr from-teal-500/25 to-cyan-400/35 blur-2xl" />
          </div>

          {viewMode === 'workflow' ? (
            <div className="relative z-10 w-full flex items-center justify-center py-2">
              <RefillWorkflowVisual mode="circular" size="sm" activeStep="all" interactive={true} />
            </div>
          ) : (
            /* Floating High-Res 3D Capsule Image with Organic Bobbing Animation */
            <motion.div
              animate={
                isPlaying
                  ? {
                      y: [0, -10, 0],
                      rotate: [-1, 2, -1],
                      scale: [1, 1.015, 1],
                    }
                  : {}
              }
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex items-center justify-center max-w-[340px]"
            >
              <img
                src="/images/capsule-hero.png"
                alt="Intelligent OushadhaSetu Refill Capsule"
                className="w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(20,184,166,0.4)]"
              />

              {/* Glowing Laser Scanline Effect */}
              {isPlaying && (
                <motion.div
                  animate={{ top: ['10%', '85%', '10%'] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.9)]"
                />
              )}
            </motion.div>
          )}

          {/* Floating In-Video Telemetry Badges */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-4 top-4 z-20 rounded-2xl border border-white/10 bg-slate-900/85 p-3 backdrop-blur-md shadow-lg max-w-[190px]"
          >
            <p className="text-[9.5px] font-mono uppercase tracking-widest text-teal-400">Target Molecule</p>
            <p className="font-display text-[13px] font-bold text-white">Metformin 500mg</p>
            <p className="mt-0.5 text-[10px] text-slate-400">ER Oral Tablet · 30 Days</p>
          </motion.div>

          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 bottom-14 z-20 rounded-2xl border border-teal-500/30 bg-teal-950/80 p-3 backdrop-blur-md shadow-lg max-w-[210px] text-right"
          >
            <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
              {activeScene.state}
            </span>
            <p className="mt-1 text-[11px] font-medium text-slate-200 truncate">{activeScene.blocker}</p>
            <p className="mt-0.5 text-[10px] font-mono text-cyan-300">Next: {activeScene.owner}</p>
          </motion.div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="relative z-20 border-t border-white/10 bg-slate-900/90 px-5 py-3.5 backdrop-blur-md">
          {/* Progress Timeline Scrubber */}
          <div className="group relative flex items-center mb-2.5 cursor-pointer">
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="absolute size-3 rounded-full bg-white shadow-md border-2 border-teal-500 -translate-x-1.5"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 text-slate-200 hover:text-teal-400 transition-colors"
              >
                {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                <span className="font-mono text-[11px]">{isPlaying ? 'Live Stream' : 'Paused'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProgress(0);
                  setActiveSceneIdx((s) => (s + 1) % REFILL_SCENES.length);
                }}
                className="text-slate-400 hover:text-white transition-colors"
                title="Restart cycle"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
              <span className="text-teal-400">{formatTime(progress)}</span>
              <span className="text-slate-600">/</span>
              <span>02:00</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sub-Card Analytics Pills */}
      <div className="mt-4 grid grid-cols-2 gap-3.5">
        <div className="rounded-2xl border border-[#EDE4D8] bg-white/95 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-stone-500">Live Intake</p>
            <Activity className="size-3.5 text-emerald-600" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-slate-950">1,420+</p>
          <p className="text-[11.5px] text-stone-600">Prescriptions synchronized</p>
        </div>

        <div className="rounded-2xl border border-[#EDE4D8] bg-white/95 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-teal-800">Human Gate</p>
            <ShieldCheck className="size-3.5 text-teal-700" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-teal-900">100%</p>
          <p className="text-[11.5px] text-stone-600">Clinician MFA verified</p>
        </div>
      </div>
    </div>
  );
}
