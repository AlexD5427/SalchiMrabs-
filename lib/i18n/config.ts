export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const localeShort: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * URL segments stay Spanish in both locales: the brand is Bolivian and the
 * slugs are part of its voice. Change a value here and every link follows.
 */
export const routes = {
  home: '',
  catalog: 'catalogo',
  recipes: 'recetas',
  clients: 'clientes',
  reserve: 'reserva',
  checkout: 'checkout',
  account: 'cuenta',
  about: 'nosotros',
} as const;

export type RouteKey = keyof typeof routes;

/** Build a locale-aware href: href('es', 'catalog', 'rocoto-bravo') */
export function href(locale: Locale, key: RouteKey = 'home', ...rest: string[]) {
  const parts = [locale, routes[key], ...rest].filter(Boolean);
  return '/' + parts.join('/');
}

/** Swap the locale segment of an existing pathname, keeping the rest intact. */
export function swapLocale(pathname: string, next: Locale) {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) {
    segments[0] = next;
  } else {
    segments.unshift(next);
  }
  return '/' + segments.join('/');
}

export function otherLocale(current: Locale): Locale {
  return current === 'es' ? 'en' : 'es';
}
