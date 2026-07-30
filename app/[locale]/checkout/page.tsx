import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.checkout.title, robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <section className="section section--top">
      <div className="wrap">
        <header className="pagehead">
          <span className="eyebrow">{dict.nav.cart}</span>
          <h1 className="title">{dict.checkout.title}</h1>
        </header>
        <CheckoutFlow locale={locale} dict={dict} />
      </div>
    </section>
  );
}
