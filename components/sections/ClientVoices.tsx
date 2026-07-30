'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { partners, testimonials } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { Marquee } from '@/components/motion/Marquee';
import { SplitText } from '@/components/motion/SplitText';
import { LinkButton } from '@/components/ui/Button';

export function ClientVoices({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  useEffect(() => {
    const id = window.setInterval(() => setIndex((value) => (value + 1) % testimonials.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="section voices"
      data-tone="ink"
      style={{ ['--accent' as string]: `oklch(64% 0.15 ${current.hue})` }}
    >
      <div className="wrap voices__head">
        <span className="eyebrow">{dict.home.clientsEyebrow}</span>
        <SplitText as="h2" className="title" text={dict.home.clientsTitle} />
      </div>

      <div className="wrap voices__body">
        <blockquote className="voices__quote">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.name}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {pick(current.quote, locale)}
            </motion.p>
          </AnimatePresence>
          <footer className="voices__author">
            <strong>{current.name}</strong>
            <span>{pick(current.role, locale)}</span>
            <span className="mono">{current.city}</span>
          </footer>
        </blockquote>

        <div className="voices__dots" role="tablist" aria-label={dict.clients.voices}>
          {testimonials.map((item, dot) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={dot === index}
              aria-label={item.name}
              className="voices__dot"
              data-active={dot === index ? 'true' : 'false'}
              onClick={() => setIndex(dot)}
            />
          ))}
        </div>

        <LinkButton href={href('/clientes', locale)} variant="outline" size="sm">
          {dict.clients.wholesaleTitle}
        </LinkButton>
      </div>

      <Marquee speed={46} reverse className="voices__partners">
        {partners.map((partner) => (
          <span key={partner} className="voices__partner">
            {partner}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
