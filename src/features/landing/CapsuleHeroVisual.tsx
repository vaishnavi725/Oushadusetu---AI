import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { RefillConsole } from './RefillConsole';
import { REFILL_SCENES } from './refill-scenes';

export function CapsuleHeroVisual() {
  const [index, setIndex] = useState(1);
  const [paused, setPaused] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { damping: 28, stiffness: 120 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { damping: 28, stiffness: 120 });

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % REFILL_SCENES.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const scene = REFILL_SCENES[index];

  return (
    <div
      className="relative mx-auto w-full max-w-[560px]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
        setPaused(false);
      }}
      onMouseEnter={() => setPaused(true)}
    >
      <div className="pointer-events-none absolute -left-8 top-8 h-40 w-40 rounded-full bg-teal-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 bottom-6 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />

      <motion.div style={{ rotateX, rotateY, transformPerspective: 1100 }} className="relative">
        <RefillConsole scene={scene} compact scenes={REFILL_SCENES} activeIndex={index} onPick={setIndex} />
      </motion.div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">Monday queue</p>
          <p className="mt-1 font-display text-2xl font-semibold text-slate-950">100</p>
          <p className="text-[12px] text-slate-500">stuck of 1,000 open</p>
        </div>
        <motion.div key={scene.id} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-teal-800">Next owner</p>
          <p className="mt-1 text-[14px] font-medium leading-snug text-slate-950">{scene.owner}</p>
          <p className="mt-0.5 text-[12px] text-slate-500">{scene.ownerRole}</p>
        </motion.div>
      </div>
    </div>
  );
}
