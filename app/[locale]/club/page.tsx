import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { PageHead } from '@/components/sections/PageHead';
import { ClubPlans } from '@/components/sections/ClubPlans';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.club.title, description: dict.club.lede };
}

export default async function ClubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead
        eyebrow={dict.home.clubEyebrow}
        title={dict.club.title}
        lede={dict.club.lede}
        hue={24}
        variant="oven"
      />
      <section className="section">
        <div className="wrap">
          <ClubPlans locale={locale} dict={dict} />
        </div>
      </section>
    </>
  );
}
