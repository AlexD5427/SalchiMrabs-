import type { Locale } from '@/lib/i18n/config';
import type { Localized } from '@/lib/types';

/** Read a bilingual field. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] ?? value.es;
}

const formatters: Partial<Record<Locale, Intl.NumberFormat>> = {};

export function money(amount: number, locale: Locale = 'es'): string {
  if (!formatters[locale]) {
    formatters[locale] = new Intl.NumberFormat(locale === 'es' ? 'es-BO' : 'en-US', {
      style: 'currency',
      currency: 'BOB',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return formatters[locale]!.format(amount).replace('BOB', 'Bs');
}

export function formatDate(iso: string, locale: Locale = 'es'): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-BO' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function pad(n: number, size = 2): string {
  return String(n).padStart(size, '0');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Accent color string for a product hue. Drives the dynamic palette. */
export function accentFor(hue: number, chroma = 0.16, lightness = 61): string {
  return `oklch(${lightness}% ${chroma} ${hue})`;
}

export function accentVars(hue: number, chroma = 0.16): Record<string, string> {
  return {
    '--accent': accentFor(hue, chroma, 61),
    '--accent-deep': accentFor(hue, chroma * 0.9, 47),
    '--accent-lift': accentFor(hue, chroma * 0.82, 74),
  } as Record<string, string>;
}

export function orderCode(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `SM-${stamp}-${rand}`;
}
