import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { CatalogRail } from '@/components/sections/CatalogRail';
import { Process } from '@/components/sections/Process';
import { RecipeStrip } from '@/components/sections/RecipeStrip';
import { ClientVoices } from '@/components/sections/ClientVoices';
import { ClubTeaser } from '@/components/sections/ClubTeaser';
import { Journal } from '@/components/sections/Journal';
import { Locations } from '@/components/sections/Locations';
import { CtaBand } from '@/components/sections/CtaBand';
import { Marquee } from '@/components/motion/Marquee';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />

      <div className="band">
        <Marquee speed={30}>
          <span>Lote 214</span>
          <span aria-hidden="true">✳</span>
          <span>{locale === 'es' ? 'Ahumado con roble viejo' : 'Smoked over old oak'}</span>
          <span aria-hidden="true">✳</span>
          <span>{locale === 'es' ? 'Sin fosfatos' : 'No phosphates'}</span>
          <span aria-hidden="true">✳</span>
          <span>{locale === 'es' ? 'Entrega en 24 h' : '24 h delivery'}</span>
          <span aria-hidden="true">✳</span>
        </Marquee>
      </div>

      <Manifesto locale={locale} dict={dict} />
      <CatalogRail locale={locale} dict={dict} />
      <Process locale={locale} dict={dict} />
      <RecipeStrip locale={locale} dict={dict} />
      <ClientVoices locale={locale} dict={dict} />
      <ClubTeaser locale={locale} dict={dict} />
      <Journal locale={locale} dict={dict} />
      <Locations locale={locale} dict={dict} />
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
