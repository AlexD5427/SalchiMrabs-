'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';

export function LocaleSwitch({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const go = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `salchimrabs.locale=${next}; path=/; max-age=31536000`;
    const segments = (pathname || `/${locale}`).split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
  };

  return (
    <div className="locale" data-compact={compact ? 'true' : 'false'}>
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          className="locale__btn"
          data-active={option === locale ? 'true' : 'false'}
          onClick={() => go(option)}
          aria-label={option === 'es' ? 'Español' : 'English'}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
