'use client';

import { useEffect, useRef, type ElementType } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  mode?: 'word' | 'char';
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
  immediate?: boolean;
}

/**
 * Masked line reveal. React owns the markup so hydration stays clean;
 * GSAP only animates the inner spans.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  className,
  mode = 'word',
  stagger = 0.045,
  delay = 0,
  duration = 1.05,
  start = 'top 88%',
  immediate = false,
}: SplitTextProps) {
  const host = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const targets = node.querySelectorAll<HTMLElement>('[data-inner]');
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return;
    }

    const context = gsap.context(() => {
      gsap.set(targets, { yPercent: 118, opacity: 0 });
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: 'expo.out',
        scrollTrigger: immediate
          ? undefined
          : { trigger: node, start, once: true },
      });
    }, node);

    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [text, mode, stagger, delay, duration, start, immediate]);

  const words = text.split(' ');

  return (
    <Tag ref={host as never} className={className} data-split aria-label={text}>
      {words.map((word, index) => (
        <span className="split__mask" key={`${word}-${index}`} aria-hidden="true">
          {mode === 'char' ? (
            <span className="split__word">
              {Array.from(word).map((char, charIndex) => (
                <span className="split__inner" data-inner key={`${char}-${charIndex}`}>
                  {char}
                </span>
              ))}
            </span>
          ) : (
            <span className="split__inner" data-inner>
              {word}
            </span>
          )}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
