'use client';

import { useEffect, useState } from 'react';

export type Tier = 'high' | 'mid' | 'low';

export interface DeviceProfile {
  tier: Tier;
  isTouch: boolean;
  isMobile: boolean;
  reduced: boolean;
  ready: boolean;
}

const INITIAL: DeviceProfile = {
  tier: 'mid',
  isTouch: false,
  isMobile: false,
  reduced: false,
  ready: false,
};

/**
 * Single source of truth for how much motion and how much WebGL a visitor
 * can afford. Every heavy component asks this before rendering.
 */
export function useDeviceTier(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(INITIAL);

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');

    const evaluate = () => {
      const width = window.innerWidth;
      const isMobile = width < 900;
      const isTouch = touchQuery.matches;
      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
      const dpr = window.devicePixelRatio || 1;

      let tier: Tier = 'high';
      if (isMobile || cores <= 4 || memory <= 4) tier = 'mid';
      if (cores <= 2 || memory <= 2 || (isMobile && dpr > 2.6)) tier = 'low';
      if (reducedQuery.matches) tier = 'low';

      setProfile({ tier, isTouch, isMobile, reduced: reducedQuery.matches, ready: true });
    };

    evaluate();

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(evaluate);
    };

    window.addEventListener('resize', onResize, { passive: true });
    reducedQuery.addEventListener('change', evaluate);
    touchQuery.addEventListener('change', evaluate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      reducedQuery.removeEventListener('change', evaluate);
      touchQuery.removeEventListener('change', evaluate);
    };
  }, []);

  return profile;
}
