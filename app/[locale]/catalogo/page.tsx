import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CatalogBrowser } from '@/components/shop/CatalogBrowser';
import { PageHead } from '@/components/sections/PageHead';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.catalog.title, description: dict.catalog.lede };
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead
        eyebrow={dict.home.catalogEyebrow}
        title={dict.catalog.title}
        lede={dict.catalog.lede}
        hue={38}
        variant="table"
      />
      <section className="section section--tight">
        <div className="wrap">
          <CatalogBrowser locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}
