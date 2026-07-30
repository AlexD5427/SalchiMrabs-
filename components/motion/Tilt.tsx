'use client';

import { useCallback, useRef, type ReactNode } from 'react';
import { useDeviceTier } from '@/lib/hooks/useDeviceTier';

interface TiltProps {
  children: ReactNode;
  max?: number;
  className?: string;
  glare?: boolean;
}

/** Discreet 3D response: rotation stays under 10deg so it reads as depth, not gimmick. */
export function Tilt({ children, max = 7, className, glare = true }: TiltProps) {
  const host = useRef<HTMLDivElement>(null);
  const { isTouch, reduced } = useDeviceTier();

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const node = host.current;
      if (!node || isTouch || reduced) return;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      node.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
      node.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
      node.style.setProperty('--mx', `${px * 100}%`);
      node.style.setProperty('--my', `${py * 100}%`);
    },
    [isTouch, max, reduced],
  );

  const onLeave = useCallback(() => {
    const node = host.current;
    if (!node) return;
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
  }, []);

  return (
    <div
      ref={host}
      className={`tilt ${className ?? ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-glare={glare ? 'true' : 'false'}
    >
      <div className="tilt__inner">{children}</div>
    </div>
  );
}
