import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { AccountPanel } from '@/components/account/AccountPanel';
import { PageHead } from '@/components/sections/PageHead';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.account.title, robots: { index: false } };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead eyebrow={dict.nav.account} title={dict.account.title} lede={dict.account.lede} hue={340} variant="chamber" />
      <section className="section">
        <div className="wrap wrap--narrow">
          <AccountPanel locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}
