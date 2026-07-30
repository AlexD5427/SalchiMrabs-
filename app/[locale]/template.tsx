'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Route transition. Opacity only on purpose: a transformed ancestor would
 * break the fixed-position pinning that ScrollTrigger relies on.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
