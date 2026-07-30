'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useDeviceTier } from '@/lib/hooks/useDeviceTier';

/** Desktop-only pointer companion. Reads data-cursor on hovered elements. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const { isTouch, reduced, ready } = useDeviceTier();
  const active = ready && !isTouch && !reduced;

  useEffect(() => {
    if (!active) return;
    const dotNode = dot.current;
    const ringNode = ring.current;
    if (!dotNode || !ringNode) return;

    const dotX = gsap.quickTo(dotNode, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dotNode, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ringNode, 'x', { duration: 0.55, ease: 'expo.out' });
    const ringY = gsap.quickTo(ringNode, 'y', { duration: 0.55, ease: 'expo.out' });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const target = (event.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      const next = target?.dataset.cursor ?? '';
      setLabel((current) => (current === next ? current : next));
      ringNode.dataset.state = target ? 'grow' : 'idle';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.dataset.cursor = 'custom';

    return () => {
      window.removeEventListener('pointermove', onMove);
      delete document.documentElement.dataset.cursor;
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={ring} className="cursor-ring" data-state="idle" aria-hidden="true">
        <span>{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
