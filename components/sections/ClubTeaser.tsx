'use client';

import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { clubTiers } from '@/lib/data/editorial';
import { money, pick } from '@/lib/utils/format';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { LinkButton } from '@/components/ui/Button';
import { Tilt } from '@/components/motion/Tilt';

export function ClubTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="section club-teaser">
      <div className="wrap club-teaser__head">
        <div>
          <span className="eyebrow">{dict.home.clubEyebrow}</span>
          <SplitText as="h2" className="title" text={dict.home.clubTitle} />
          <p className="lede">{dict.home.clubBody}</p>
        </div>
        <LinkButton href={href('/club', locale)} variant="ink" size="md" magnetic>
          {dict.club.join}
        </LinkButton>
      </div>

      <div className="wrap club-teaser__tiers">
        {clubTiers.map((tier, index) => (
          <Reveal key={tier.slug} delay={index * 0.08} from="up">
            <Tilt max={5}>
              <div
                className="tier"
                data-popular={tier.popular ? 'true' : 'false'}
                style={{ ['--accent' as string]: `oklch(62% 0.16 ${tier.hue})` }}
              >
                <div className="tier__head">
                  <h3 className="tier__name">{pick(tier.name, locale)}</h3>
                  {tier.popular ? <span className="tier__flag mono">{dict.club.popular}</span> : null}
                </div>
                <p className="tier__price num">
                  {money(tier.price, locale)}
                  <span className="mono">{dict.club.perMonth}</span>
                </p>
                <p className="tier__tagline">{pick(tier.tagline, locale)}</p>
                <ul className="tier__perks">
                  {tier.perks.map((perk) => (
                    <li key={perk.es}>{pick(perk, locale)}</li>
                  ))}
                </ul>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
