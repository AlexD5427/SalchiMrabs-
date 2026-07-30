'use client';

import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { shops } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

export function Locations({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="section locations">
      <div className="wrap locations__head">
        <span className="eyebrow">{dict.home.locationsEyebrow}</span>
        <SplitText as="h2" className="title" text={dict.home.locationsTitle} />
      </div>

      <div className="wrap locations__list">
        {shops.map((shop, index) => (
          <Reveal key={shop.name} delay={index * 0.05} from="up" distance={20}>
            <div className="shop">
              <span className="shop__index mono">{String(index + 1).padStart(2, '0')}</span>
              <div className="shop__body">
                <h3 className="shop__name">{shop.name}</h3>
                <p>{pick(shop.address, locale)}</p>
              </div>
              <div className="shop__meta mono">
                <span>{shop.city}</span>
                <span>{pick(shop.hours, locale)}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
