import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { PageHead } from '@/components/sections/PageHead';

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
    <>
      <PageHead eyebrow={dict.nav.cart} title={dict.checkout.title} hue={42} variant="smoke" />
      <section className="section">
        <div className="wrap">
          <CheckoutFlow locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}
