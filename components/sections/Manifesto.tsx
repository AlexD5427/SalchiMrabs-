'use client';

import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { SceneArt } from '@/components/art/SceneArt';
import { figures } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';

export function Manifesto({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="section manifesto" id="manifesto">
      <div className="wrap manifesto__grid">
        <div className="manifesto__text">
          <span className="eyebrow">{dict.home.manifestoEyebrow}</span>
          <SplitText as="h2" className="manifesto__title title" text={dict.home.manifestoTitle} mode="word" />
          <Reveal delay={0.1}>
            <p className="lede manifesto__body">{dict.home.manifestoBody}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="manifesto__sign italic-serif">{dict.home.manifestoSign}</p>
          </Reveal>

          <dl className="manifesto__figures">
            {figures.map((figure, index) => (
              <Reveal key={figure.value} delay={0.06 * index} from="up" distance={22}>
                <div className="manifesto__figure">
                  <dt className="num">{figure.value}</dt>
                  <dd>{pick(figure.label, locale)}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="manifesto__media">
          <Parallax amount={70} scale className="manifesto__frame">
            <SceneArt hue={28} variant="chamber" />
          </Parallax>
          <span className="manifesto__caption mono">Cámara 2 · 12 °C · 75 % HR</span>
        </div>
      </div>
    </section>
  );
}
