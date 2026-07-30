'use client';

import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { journal } from '@/lib/data/editorial';
import { formatDate, pick } from '@/lib/utils/format';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

export function Journal({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="section journal">
      <div className="wrap journal__head">
        <span className="eyebrow">{dict.home.journalEyebrow}</span>
        <SplitText as="h2" className="title" text={dict.home.journalTitle} />
      </div>

      <div className="wrap journal__list">
        {journal.map((note, index) => (
          <Reveal key={note.slug} delay={index * 0.07} from="up" distance={28}>
            <article className="note" style={{ ['--accent' as string]: `oklch(62% 0.15 ${note.hue})` }}>
              <div className="note__meta mono">
                <span>{formatDate(note.date, locale)}</span>
                <span>
                  {note.minutes} {dict.recipes.minutes}
                </span>
              </div>
              <h3 className="note__title">{pick(note.title, locale)}</h3>
              <p className="note__excerpt">{pick(note.excerpt, locale)}</p>
              <span className="note__rule" aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
