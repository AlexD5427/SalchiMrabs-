'use client';

import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { SplitText } from '@/components/motion/SplitText';
import { LinkButton } from '@/components/ui/Button';
import { Parallax } from '@/components/motion/Parallax';
import { SceneArt } from '@/components/art/SceneArt';

export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="cta" data-tone="ink">
      <div className="cta__art" aria-hidden="true">
        <Parallax amount={90} scale>
          <SceneArt hue={40} variant="table" />
        </Parallax>
      </div>

      <div className="wrap cta__inner">
        <SplitText as="h2" className="display cta__title" text={dict.home.ctaTitle} />
        <p className="cta__body">{dict.home.ctaBody}</p>
        <div className="cta__actions">
          <LinkButton href={href('/catalogo', locale)} size="lg" magnetic cursor="→">
            {dict.hero.ctaPrimary}
          </LinkButton>
          <LinkButton href={href('/reservas', locale)} variant="outline" size="lg">
            {dict.common.reserve}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
