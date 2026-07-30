'use client';

import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}

/** CSS-driven ticker: cheap on mobile, pauses on hover, duplicated for seam-free loop. */
export function Marquee({ children, speed = 34, reverse = false, className }: MarqueeProps) {
  return (
    <div className={`marquee ${className ?? ''}`} data-reverse={reverse ? 'true' : 'false'}>
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
