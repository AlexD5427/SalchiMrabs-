'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { processSteps } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { useUi } from '@/lib/store/ui';
import { SceneArt } from '@/components/art/SceneArt';
import { SplitText } from '@/components/motion/SplitText';

/** Sticky scene on the left, stepping copy on the right, accent repaints per step. */
export function Process({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const host = useRef<HTMLElement>(null);
  const { setAccent, resetAccent } = useUi();

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const context = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]');

      steps.forEach((step) => {
        const hue = Number(step.dataset.hue ?? 38);

        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setAccent(hue, 0.16),
          onEnterBack: () => setAccent(hue, 0.16),
        });

        if (prefersReducedMotion()) return;

        gsap.fromTo(
          step.querySelectorAll('[data-step-part]'),
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: step, start: 'top 78%', once: true },
          },
        );
      });
    }, node);

    return () => {
      context.revert();
      resetAccent();
    };
  }, [setAccent, resetAccent]);

  return (
    <section className="section process" id="proceso" ref={host}>
      <div className="wrap process__head">
        <span className="eyebrow">{dict.home.processEyebrow}</span>
        <SplitText as="h2" className="title" text={dict.home.processTitle} />
      </div>

      <div className="wrap process__grid">
        <div className="process__sticky">
          <div className="process__scene">
            <SceneArt hue={38} variant="oven" />
            <span className="process__sceneMeta mono">Horno 1 · roble viejo · 9–14 h</span>
          </div>
        </div>

        <ol className="process__steps">
          {processSteps.map((step) => (
            <li className="process__step" key={step.n} data-step data-hue={step.hue}>
              <span className="process__n num" data-step-part>
                {step.n}
              </span>
              <h3 className="process__title" data-step-part>
                {pick(step.title, locale)}
              </h3>
              <p className="process__body" data-step-part>
                {pick(step.body, locale)}
              </p>
              <span className="process__rule" data-step-part aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
