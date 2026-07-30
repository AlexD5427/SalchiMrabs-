'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface CountUpProps {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ to, suffix = '', duration = 1.6, className }: CountUpProps) {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      node.textContent = `${to}${suffix}`;
      return;
    }

    const proxy = { value: 0 };
    const context = gsap.context(() => {
      gsap.to(proxy, {
        value: to,
        duration,
        ease: 'expo.out',
        onUpdate: () => {
          node.textContent = `${Math.round(proxy.value)}${suffix}`;
        },
        scrollTrigger: { trigger: node, start: 'top 92%', once: true },
      });
    }, node);

    return () => context.revert();
  }, [to, suffix, duration]);

  return (
    <span ref={host} className={className}>
      0{suffix}
    </span>
  );
}
