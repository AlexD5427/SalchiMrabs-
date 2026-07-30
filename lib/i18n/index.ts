import { es } from './dictionaries/es';
import { en } from './dictionaries/en';
import { defaultLocale, type Locale } from './config';

export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = {
  es,
  en: en as unknown as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Pick the right side of a bilingual data field. */
export function pick<T>(value: Record<Locale, T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale];
}

/** fill('{n} piezas', { n: 3 }) -> '3 piezas' */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}

export type { Locale };
