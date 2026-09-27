import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SceneTransitionSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export function SceneTransitionSection({
  children,
  id,
  className = '',
  delay = 0,
  direction = 'up',
}: SceneTransitionSectionProps) {
  const initialOffset =
    direction === 'left' ? { x: -40, y: 0 } : direction === 'right' ? { x: 40, y: 0 } : { x: 0, y: 50 };

  return (
    <motion.section
      id={id}
      initial={{
        opacity: 0.15,
        scale: 0.985,
        ...initialOffset,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.15, // Smooth entrance when 15% visible
        margin: '0px 0px -100px 0px',
      }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1], // Natural, human-designed cubic bezier
      }}
      className={`relative z-10 transition-colors duration-700 ${className}`}
    >
      {children}
    </motion.section>
  );
}
