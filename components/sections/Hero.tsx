'use client';

import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { useUi } from '@/lib/store/ui';
import { EmberScene } from '@/components/three/EmberScene';
import { SceneArt } from '@/components/art/SceneArt';
import { SplitText } from '@/components/motion/SplitText';
import { CountUp } from '@/components/motion/CountUp';
import { LinkButton } from '@/components/ui/Button';
import { scrollToId } from '@/components/motion/SmoothScroll';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { booted } = useUi();
  const key = booted ? 'on' : 'off';

  return (
    <section className="hero" data-tone="ink">
      <div className="hero__base" aria-hidden="true">
        <SceneArt hue={38} variant="smoke" />
      </div>
      <EmberScene hue={38} className="hero__scene" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="wrap hero__inner">
        <span className="eyebrow hero__eyebrow">{dict.hero.eyebrow}</span>

        <h1 className="hero__title">
          <span className="hero__line">
            <SplitText key={`a-${key}`} text={dict.hero.l1} immediate delay={0.1} />
            <em>
              <SplitText key={`b-${key}`} text={dict.hero.l2} immediate delay={0.2} />
            </em>
          </span>
          <span className="hero__line hero__line--offset">
            <SplitText key={`c-${key}`} text={dict.hero.l3} immediate delay={0.3} />
            <SplitText key={`d-${key}`} text={dict.hero.l4} immediate delay={0.4} />
          </span>
        </h1>

        <div className="hero__aside">
          <p className="hero__lede">{dict.hero.lede}</p>
          <div className="hero__actions">
            <LinkButton href={href('/catalogo', locale)} variant="solid" size="lg" magnetic cursor="→">
              {dict.hero.ctaPrimary}
            </LinkButton>
            <button type="button" className="hero__link" onClick={() => scrollToId('proceso')}>
              {dict.hero.ctaSecondary}
            </button>
          </div>
        </div>

        <dl className="hero__stats">
          <div>
            <dt className="num">
              <CountUp to={100} />
            </dt>
            <dd>{dict.hero.stats.batch}</dd>
          </div>
          <div>
            <dt className="num">
              <CountUp to={14} />
            </dt>
            <dd>{dict.hero.stats.hours}</dd>
          </div>
          <div>
            <dt className="num">
              <CountUp to={12} />
            </dt>
            <dd>{dict.hero.stats.years}</dd>
          </div>
        </dl>

        <button type="button" className="hero__scroll" onClick={() => scrollToId('manifesto')}>
          <span className="mono">{dict.common.scroll}</span>
          <span className="hero__scrollLine" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
