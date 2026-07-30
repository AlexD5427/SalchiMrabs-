'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { clubTiers } from '@/lib/data/editorial';
import { money, pick } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Tilt } from '@/components/motion/Tilt';
import { Reveal } from '@/components/motion/Reveal';
import { useUi } from '@/lib/store/ui';

export function ClubPlans({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { toast } = useUi();
  const [selected, setSelected] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const active = clubTiers.find((tier) => tier.slug === selected);

  return (
    <div className="plans">
      <div className="plans__grid">
        {clubTiers.map((tier, index) => (
          <Reveal key={tier.slug} delay={index * 0.07}>
            <Tilt max={6}>
              <div
                className="plan"
                data-popular={tier.popular ? 'true' : 'false'}
                data-active={selected === tier.slug ? 'true' : 'false'}
                style={{ ['--accent' as string]: `oklch(62% 0.16 ${tier.hue})` }}
              >
                <div className="plan__head">
                  <h3>{pick(tier.name, locale)}</h3>
                  {tier.popular ? <span className="mono plan__flag">{dict.club.popular}</span> : null}
                </div>
                <p className="plan__price num">
                  {money(tier.price, locale)}
                  <span className="mono">{dict.club.perMonth}</span>
                </p>
                <p className="plan__tagline">{pick(tier.tagline, locale)}</p>
                <span className="mono plan__includes">{dict.club.includes}</span>
                <ul className="plan__perks">
                  {tier.perks.map((perk) => (
                    <li key={perk.es}>{pick(perk, locale)}</li>
                  ))}
                </ul>
                <Button
                  variant={tier.popular ? 'solid' : 'outline'}
                  full
                  onClick={() => {
                    setSelected(tier.slug);
                    setJoined(null);
                  }}
                >
                  {dict.club.join}
                </Button>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>

      {active ? (
        <div className="plans__join" style={{ ['--accent' as string]: `oklch(62% 0.16 ${active.hue})` }}>
          {joined ? (
            <div className="formdone">
              <h3>
                {dict.club.join} · {joined}
              </h3>
              <p className="mono">{dict.checkout.demoNote}</p>
            </div>
          ) : (
            <form
              className="plans__form"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const email = String(data.get('email') ?? '');
                if (!email.includes('@')) {
                  setError(dict.common.required);
                  return;
                }
                setError(undefined);
                setJoined(pick(active.name, locale));
                toast(`${dict.club.join}: ${pick(active.name, locale)}`);
              }}
            >
              <div>
                <span className="mono">{pick(active.name, locale)}</span>
                <strong className="num">
                  {money(active.price, locale)}
                  {dict.club.perMonth}
                </strong>
              </div>
              <Field label={dict.account.email} name="email" type="email" required error={error} />
              <Button type="submit" size="lg">
                {dict.club.join}
              </Button>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
