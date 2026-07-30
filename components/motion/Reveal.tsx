'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  from?: Direction;
  delay?: number;
  distance?: number;
  duration?: number;
  amount?: number;
}

const OFFSETS: Record<Direction, (d: number) => Record<string, number>> = {
  up: (d) => ({ y: d }),
  down: (d) => ({ y: -d }),
  left: (d) => ({ x: d }),
  right: (d) => ({ x: -d }),
  scale: () => ({ scale: 0.94 }),
  fade: () => ({}),
};

export function Reveal({
  children,
  from = 'up',
  delay = 0,
  distance = 34,
  duration = 0.9,
  amount = 0.25,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = OFFSETS[from](distance);

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  stagger = 0.08,
  ...rest
}: { children: ReactNode; stagger?: number } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
};
