import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ContinuousRefillFlowProps {
  className?: string;
}

export function ContinuousRefillFlow({ className = '' }: ContinuousRefillFlowProps) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Transform scroll progress to animate flow stroke
  const pathLength = useTransform(smoothProgress, [0, 0.95], [0.15, 1]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.3, 0.6, 1], [0.4, 0.8, 0.9, 0.6]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 
        Full-height SVG continuous flow ribbon.
        Weaves organically through the page, connecting the Hero capsule
        to every section as one continuous physical-digital pipeline.
      */}
      <svg
        className="h-full w-full opacity-45 lg:opacity-65"
        viewBox="0 0 1440 3600"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan Glow Filter */}
          <filter id="pipelineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="18" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electric Cyan & Soft Blue Gradient along path */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
            <stop offset="15%" stopColor="#087BFF" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#00D9FF" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#4DA3FF" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#00D9FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#087BFF" stopOpacity="0.85" />
          </linearGradient>

          {/* Core high-intensity neon laser */}
          <linearGradient id="laserWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* 
          Continuous S-curve flow path running through all page sections:
          1. Hero (right to left): starts at right capsule, sweeps under headline (x: 1050 -> 400)
          2. About section: loops gently down left edge (x: 160)
          3. Pyramid / Solutions: sweeps toward center-right (x: 880)
          4. Walkthrough & Ecosystem: traverses through the middle (x: 720)
          5. Digital Twin & Silent Lapse: anchors into the lower infrastructure (x: 350 -> 720)
        */}
        {/* Layer 1: Ambient Translucent Conduit Path */}
        <path
          d="M 1080 220 
             C 980 420, 520 480, 240 680 
             C 80 840, 140 1150, 220 1400 
             C 320 1700, 1150 1850, 1120 2200 
             C 1090 2500, 320 2700, 420 3050 
             C 500 3300, 850 3450, 720 3600"
          stroke="rgba(8, 123, 255, 0.12)"
          strokeWidth="28"
          strokeLinecap="round"
        />

        {/* Layer 2: Glowing Cyan Pipe */}
        <motion.path
          d="M 1080 220 
             C 980 420, 520 480, 240 680 
             C 80 840, 140 1150, 220 1400 
             C 320 1700, 1150 1850, 1120 2200 
             C 1090 2500, 320 2700, 420 3050 
             C 500 3300, 850 3450, 720 3600"
          stroke="url(#flowGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#pipelineGlow)"
          style={{ pathLength }}
        />

        {/* Layer 3: Rapid Animated Medicine Refill Packets (Continuous movement) */}
        <motion.path
          d="M 1080 220 
             C 980 420, 520 480, 240 680 
             C 80 840, 140 1150, 220 1400 
             C 320 1700, 1150 1850, 1120 2200 
             C 1090 2500, 320 2700, 420 3050 
             C 500 3300, 850 3450, 720 3600"
          stroke="url(#laserWhiteGrad)"
          strokeWidth="3.5"
          strokeDasharray="24 48"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -720] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: glowOpacity }}
        />

        {/* Layer 4: Secondary High-Frequency Micro-particles */}
        <motion.path
          d="M 1080 220 
             C 980 420, 520 480, 240 680 
             C 80 840, 140 1150, 220 1400 
             C 320 1700, 1150 1850, 1120 2200 
             C 1090 2500, 320 2700, 420 3050 
             C 500 3300, 850 3450, 720 3600"
          stroke="#00D9FF"
          strokeWidth="2"
          strokeDasharray="6 80"
          strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -1200] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </div>
  );
}
