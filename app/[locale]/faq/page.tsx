import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { href } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { faq } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { Accordion } from '@/components/ui/Accordion';
import { PageHead } from '@/components/sections/PageHead';
import { LinkButton } from '@/components/ui/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.faq.title, description: dict.faq.lede };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead eyebrow={dict.nav.faq} title={dict.faq.title} lede={dict.faq.lede} hue={118} variant="smoke" />
      <section className="section">
        <div className="wrap wrap--narrow">
          <Accordion items={faq.map((item) => ({ q: pick(item.q, locale), a: pick(item.a, locale) }))} />
          <div className="faq__cta">
            <p className="lede">hola@salchimrabs.bo · +591 2 212 3456</p>
            <LinkButton href={href('/reservas', locale)} variant="ink">
              {dict.common.reserve}
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
