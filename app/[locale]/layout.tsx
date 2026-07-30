import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/ui.css';
import '@/styles/shell.css';
import '@/styles/sections.css';
import '@/styles/pages.css';
import '@/styles/patch.css';

import { isLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Providers } from '@/components/shell/Providers';
import { Preloader } from '@/components/shell/Preloader';
import { Nav } from '@/components/shell/Nav';
import { MenuOverlay } from '@/components/shell/MenuOverlay';
import { CartDrawer } from '@/components/shell/CartDrawer';
import { MobileBar } from '@/components/shell/MobileBar';
import { Footer } from '@/components/shell/Footer';
import { Toasts } from '@/components/shell/Toasts';
import { GlobalKeys } from '@/components/shell/GlobalKeys';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { Cursor } from '@/components/motion/Cursor';

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--f-display',
  display: 'swap',
});

const sans = Archivo({
  subsets: ['latin'],
  variable: '--f-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--f-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return {
    title: { default: dict.meta.title, template: '%s · SalchiMrabs' },
    description: dict.meta.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://salchimrabs.vercel.app'),
    icons: { icon: '/favicon.svg' },
    alternates: {
      canonical: `/${locale}`,
      languages: { es: '/es', en: '/en' },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === 'es' ? 'es_BO' : 'en_US',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Preloader dict={dict} />
          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
          <GlobalKeys />

          <a className="skip" href="#main">
            {dict.nav.index}
          </a>

          <Nav locale={locale} dict={dict} />
          <MenuOverlay locale={locale} dict={dict} />
          <CartDrawer locale={locale} dict={dict} />

          <main id="main">{children}</main>

          <Footer locale={locale} dict={dict} />
          <MobileBar locale={locale} dict={dict} />
          <Toasts />
          <div className="grain" aria-hidden="true" />
        </Providers>
      </body>
    </html>
  );
}
