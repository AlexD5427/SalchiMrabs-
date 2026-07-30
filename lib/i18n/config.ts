export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const LOCALE_COOKIE = 'salchimrabs.locale';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Locale-aware href builder. `href('/catalogo', 'en')` -> `/en/catalog` */
const ROUTE_MAP: Record<string, Record<Locale, string>> = {
  '/': { es: '/', en: '/' },
  '/catalogo': { es: '/catalogo', en: '/catalogo' },
  '/recetas': { es: '/recetas', en: '/recetas' },
  '/clientes': { es: '/clientes', en: '/clientes' },
  '/club': { es: '/club', en: '/club' },
  '/taller': { es: '/taller', en: '/taller' },
  '/reservas': { es: '/reservas', en: '/reservas' },
  '/checkout': { es: '/checkout', en: '/checkout' },
  '/cuenta': { es: '/cuenta', en: '/cuenta' },
  '/faq': { es: '/faq', en: '/faq' },
};

export function href(path: string, locale: Locale): string {
  const mapped = ROUTE_MAP[path]?.[locale] ?? path;
  return mapped === '/' ? `/${locale}` : `/${locale}${mapped}`;
}
