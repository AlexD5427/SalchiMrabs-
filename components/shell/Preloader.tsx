'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useUi } from '@/lib/store/ui';
import type { Dictionary } from '@/lib/i18n/es';

const SEEN_KEY = 'salchimrabs.booted';

/**
 * Opening curtain. Counts the batch up to 100, draws the monogram, then
 * splits and lifts. Shown once per session so navigation stays instant.
 */
export function Preloader({ dict }: { dict: Dictionary }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const { setBooted } = useUi();
  const [mounted, setMounted] = useState(false);
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    const seen = typeof window !== 'undefined' && window.sessionStorage.getItem(SEEN_KEY) === '1';
    if (seen || prefersReducedMotion()) {
      setBooted(true);
      setSkip(true);
      return;
    }
    setSkip(false);
    setMounted(true);
  }, [setBooted]);

  useEffect(() => {
    if (!mounted || skip) return;
    const node = root.current;
    const countNode = counter.current;
    if (!node || !countNode) return;

    document.body.dataset.locked = 'true';
    const proxy = { value: 0 };

    const timeline = gsap.timeline({
      onComplete: () => {
        window.sessionStorage.setItem(SEEN_KEY, '1');
        document.body.dataset.locked = 'false';
        setBooted(true);
        setMounted(false);
      },
    });

    timeline
      .fromTo(
        node.querySelectorAll('[data-pre-line]'),
        { yPercent: 130, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out' },
        0,
      )
      .fromTo(
        node.querySelectorAll('[data-pre-draw]'),
        { drawSVG: undefined, strokeDasharray: 260, strokeDashoffset: 260 },
        { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' },
        0.15,
      )
      .to(
        proxy,
        {
          value: 100,
          duration: 1.9,
          ease: 'power1.inOut',
          onUpdate: () => {
            countNode.textContent = String(Math.round(proxy.value)).padStart(3, '0');
          },
        },
        0,
      )
      .to(node.querySelector('[data-pre-bar]'), { scaleX: 1, duration: 1.9, ease: 'power1.inOut' }, 0)
      .to(node.querySelectorAll('[data-pre-fade]'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, 2.05)
      .to(
        node.querySelectorAll('[data-pre-panel]'),
        {
          yPercent: (index: number) => (index % 2 === 0 ? -101 : 101),
          duration: 1.15,
          stagger: 0.06,
          ease: 'expo.inOut',
        },
        2.15,
      );

    return () => {
      timeline.kill();
      document.body.dataset.locked = 'false';
    };
  }, [mounted, skip, setBooted]);

  if (skip || !mounted) return null;

  return (
    <div className="preloader" ref={root} role="status" aria-live="polite">
      <div className="preloader__panels" aria-hidden="true">
        <span data-pre-panel />
        <span data-pre-panel />
        <span data-pre-panel />
        <span data-pre-panel />
      </div>

      <div className="preloader__content">
        <div className="preloader__mark" data-pre-fade>
          <svg viewBox="0 0 120 90" aria-hidden="true">
            <path
              data-pre-draw
              d="M22 66C10 57 12 33 30 25c16-7 32 1 39 12 6 10 20 13 30 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="96" cy="28" r="4.5" fill="currentColor" />
          </svg>
        </div>

        <div className="preloader__lines">
          <span className="preloader__mask">
            <span className="preloader__line" data-pre-line>
              SalchiMrabs
            </span>
          </span>
          <span className="preloader__mask">
            <span className="preloader__line preloader__line--sub" data-pre-line>
              {dict.preloader.house}
            </span>
          </span>
        </div>

        <div className="preloader__meta" data-pre-fade>
          <span className="mono">{dict.preloader.line}</span>
          <span className="preloader__count num" ref={counter}>
            000
          </span>
        </div>

        <div className="preloader__barTrack" data-pre-fade>
          <span className="preloader__bar" data-pre-bar />
        </div>

        <p className="preloader__hint mono" data-pre-fade>
          {dict.preloader.hint}
        </p>
      </div>
    </div>
  );
}
