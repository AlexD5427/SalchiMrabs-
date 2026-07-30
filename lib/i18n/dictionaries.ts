import es, { type Dictionary } from './es';
import en from './en';
import { defaultLocale, type Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale | string): Dictionary {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}

export type { Dictionary };
