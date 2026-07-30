'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUi } from '@/lib/store/ui';

export function Toasts() {
  const { toasts, dismiss } = useUi();

  return (
    <div className="toasts" role="region" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            className="toast"
            data-tone={toast.tone}
            onClick={() => dismiss(toast.id)}
            layout
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {toast.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
