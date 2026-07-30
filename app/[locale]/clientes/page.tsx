import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { partners, testimonials, wholesaleTiers } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { PageHead } from '@/components/sections/PageHead';
import { Reveal } from '@/components/motion/Reveal';
import { Marquee } from '@/components/motion/Marquee';
import { WholesaleForm } from '@/components/forms/WholesaleForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.clients.title, description: dict.clients.lede };
}

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead
        eyebrow={dict.home.clientsEyebrow}
        title={dict.clients.title}
        lede={dict.clients.lede}
        hue={202}
        variant="chamber"
      />

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">{dict.clients.voices}</span>
          <div className="quotes">
            {testimonials.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.06}>
                <blockquote className="quote" style={{ ['--accent' as string]: `oklch(62% 0.15 ${item.hue})` }}>
                  <p>{pick(item.quote, locale)}</p>
                  <footer>
                    <strong>{item.name}</strong>
                    <span>{pick(item.role, locale)}</span>
                    <span className="mono">{item.city}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" data-tone="ink">
        <div className="wrap">
          <span className="eyebrow">{dict.clients.partners}</span>
        </div>
        <Marquee speed={38}>
          {partners.map((partner) => (
            <span key={partner} className="voices__partner">
              {partner}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="section wholesale">
        <div className="wrap wholesale__grid">
          <div>
            <span className="eyebrow">{dict.clients.wholesaleTitle}</span>
            <h2 className="title">{dict.clients.wholesaleBody}</h2>

            <div className="wholesale__tiers">
              {wholesaleTiers.map((tier) => (
                <div key={tier.from} className="wtier">
                  <div className="wtier__head">
                    <strong>{pick(tier.name, locale)}</strong>
                    <span className="wtier__off mono">{tier.discount}</span>
                  </div>
                  <span className="wtier__from num">
                    {tier.from}+ {dict.clients.tierUnit}
                  </span>
                  <ul>
                    {tier.perks.map((perk) => (
                      <li key={perk.es}>{pick(perk, locale)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="wholesale__form">
            <h3 className="subtitle">{dict.clients.formTitle}</h3>
            <WholesaleForm locale={locale} dict={dict} />
          </div>
        </div>
      </section>
    </>
  );
}
