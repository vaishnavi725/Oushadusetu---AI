import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export function MedicineVisual({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle physical parallax on mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 28, stiffness: 75 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center select-none ${className}`}
    >
      {/* Soft circular glowing light effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-[280px] rounded-full bg-[var(--pharmalink-primary)] opacity-15 blur-[90px]" />
        <div className="size-[200px] rounded-full bg-cyan-400 opacity-20 blur-[70px]" />
        <div className="size-[340px] rounded-full bg-[#fef3ee] opacity-30 blur-[100px]" />
      </div>

      {/* Orbiting Glass Rings */}
      <div className="absolute inset-8 rounded-full border border-teal-500/15 pointer-events-none animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-16 rounded-full border border-teal-400/10 border-dashed pointer-events-none animate-[spin_40s_linear_infinite_reverse]" />

      {/* Central Floating Capsule & Pills Composition */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-20 flex items-center justify-center w-[78%] h-[78%]"
      >
        {/* Floating Capsule */}
        <motion.div
          animate={{
            y: [-7, 7, -7],
            rotateZ: [-2.5, 2.5, -2.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Natural Depth Shadow */}
          <div className="absolute inset-12 rounded-full bg-slate-900/30 blur-2xl pointer-events-none" />

          {/* Central Blue/Cyan Photorealistic Medical Capsule */}
          <img
            src="/images/capsule-hero.png"
            alt="Intelligent Medication Refill Capsule"
            className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(13,148,136,0.35)]"
            draggable={false}
          />
        </motion.div>

        {/* Floating Tablet 1: Top Right */}
        <motion.div
          animate={{
            y: [-10, 8, -10],
            rotateZ: [0, 15, 0],
          }}
          transition={{
            duration: 5.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
          className="absolute -top-2 right-4 z-30 size-12 rounded-full bg-gradient-to-br from-white/90 to-teal-50/80 border border-teal-200/50 shadow-[0_8px_20px_rgba(13,148,136,0.18)] flex items-center justify-center backdrop-blur-md"
        >
          <div className="size-4 rounded-full bg-teal-400/30 border border-teal-400/50" />
        </motion.div>

        {/* Floating Tablet 2: Bottom Left */}
        <motion.div
          animate={{
            y: [8, -8, 8],
            rotateZ: [0, -20, 0],
          }}
          transition={{
            duration: 5.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
          className="absolute -bottom-3 left-6 z-30 size-10 rounded-full bg-gradient-to-br from-white/95 to-slate-100/90 border border-white shadow-[0_6px_16px_rgba(15,23,42,0.1)] flex items-center justify-center backdrop-blur-md"
        >
          <div className="w-5 h-[1.5px] bg-slate-300 rounded-full" />
        </motion.div>

        {/* Floating Soft Medicine Particles */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.85, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-12 left-2 size-2.5 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.8)]"
        />

        <motion.div
          animate={{
            scale: [1.2, 0.9, 1.2],
            opacity: [0.6, 0.25, 0.6],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-16 right-2 size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
        />
      </motion.div>
    </div>
  );
}
