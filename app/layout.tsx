import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/ui.css';
import '@/styles/shell.css';
import '@/styles/sections.css';
import '@/styles/pages.css';
import '@/styles/patch.css';

import { defaultLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

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

const dict = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: { default: dict.meta.title, template: '%s · SalchiMrabs' },
  description: dict.meta.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://salchimrabs.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

/**
 * The one canonical root layout. Locale-specific chrome lives in
 * app/[locale]/layout.tsx, which keeps /_not-found and the root redirect
 * inside a valid document shell.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
