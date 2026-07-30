import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { shops } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { PageHead } from '@/components/sections/PageHead';
import { ReserveForm } from '@/components/forms/ReserveForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.reserve.title, description: dict.reserve.lede };
}

export default async function ReservePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead
        eyebrow={dict.nav.reserve}
        title={dict.reserve.title}
        lede={dict.reserve.lede}
        hue={92}
        variant="table"
      />

      <section className="section">
        <div className="wrap split">
          <ReserveForm locale={locale} dict={dict} />

          <aside className="split__aside">
            <span className="eyebrow">{dict.home.locationsTitle}</span>
            <ul className="split__shops">
              {shops.map((shop) => (
                <li key={shop.name}>
                  <strong>{shop.name}</strong>
                  <span>{pick(shop.address, locale)}</span>
                  <span className="mono">{pick(shop.hours, locale)}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
