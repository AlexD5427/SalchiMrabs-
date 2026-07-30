'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface ParallaxProps {
  children: ReactNode;
  amount?: number;
  scale?: boolean;
  className?: string;
}

/** Scrub-linked translate. Transform only, never layout. */
export function Parallax({ children, amount = 80, scale = false, className }: ParallaxProps) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        node,
        { yPercent: 0, scale: scale ? 1.14 : 1 },
        {
          yPercent: (amount / node.offsetHeight) * 100 * -1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );
    }, node);

    return () => context.revert();
  }, [amount, scale]);

  return (
    <div ref={host} className={className} data-parallax>
      {children}
    </div>
  );
}
