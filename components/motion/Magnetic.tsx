'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { useDeviceTier } from '@/lib/hooks/useDeviceTier';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Pointer magnetism. Disabled outright on touch and reduced-motion. */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const host = useRef<HTMLSpanElement>(null);
  const { isTouch, reduced, ready } = useDeviceTier();

  useEffect(() => {
    const node = host.current;
    if (!node || !ready || isTouch || reduced) return;

    const moveX = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'expo.out' });
    const moveY = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'expo.out' });

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);

    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [isTouch, reduced, ready, strength]);

  return (
    <span ref={host} className={`magnetic ${className ?? ''}`}>
      {children}
    </span>
  );
}
