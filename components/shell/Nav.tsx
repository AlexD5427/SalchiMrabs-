'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { LocaleSwitch } from './LocaleSwitch';

interface NavProps {
  locale: Locale;
  dict: Dictionary;
}

export function Nav({ locale, dict }: NavProps) {
  const { menuOpen, toggleMenu, openCart } = useUi();
  const { count } = useCart();
  const pathname = usePathname();
  const [state, setState] = useState<'top' | 'pinned' | 'hidden'>('top');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setState('top');
      else if (y > lastY.current + 6) setState('hidden');
      else if (y < lastY.current - 6) setState('pinned');
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: Array<{ path: string; label: string }> = [
    { path: '/catalogo', label: dict.nav.catalog },
    { path: '/recetas', label: dict.nav.recipes },
    { path: '/taller', label: dict.nav.workshop },
    { path: '/club', label: dict.nav.club },
    { path: '/clientes', label: dict.nav.clients },
  ];

  return (
    <header className="nav" data-state={menuOpen ? 'top' : state}>
      <div className="nav__inner">
        <Link href={href('/', locale)} className="nav__brand" aria-label="SalchiMrabs" data-cursor="">
          <svg viewBox="0 0 44 34" aria-hidden="true" className="nav__mark">
            <path
              d="M8 25C2 21 3 10 12 6c8-3 16 1 19 6 3 5 9 6 13 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="37" cy="9" r="2.6" fill="currentColor" />
          </svg>
          <span className="nav__word">SalchiMrabs</span>
        </Link>

        <nav className="nav__links" aria-label={dict.nav.index}>
          {links.map((link) => {
            const target = href(link.path, locale);
            const active = pathname === target || pathname.startsWith(`${target}/`);
            return (
              <Link key={link.path} href={target} className="nav__link" data-active={active ? 'true' : 'false'}>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="nav__side">
          <LocaleSwitch locale={locale} compact />
          <Link href={href('/cuenta', locale)} className="nav__ghost">
            {dict.nav.account}
          </Link>
          <button type="button" className="nav__bag" onClick={openCart} aria-label={dict.nav.cart}>
            <span className="nav__bagLabel">{dict.nav.cart}</span>
            <span className="nav__bagCount num" data-filled={count > 0 ? 'true' : 'false'}>
              {String(count).padStart(2, '0')}
            </span>
          </button>
          <button
            type="button"
            className="nav__burger"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? dict.nav.close : dict.nav.menu}
          >
            <span data-open={menuOpen ? 'true' : 'false'} />
            <span data-open={menuOpen ? 'true' : 'false'} />
          </button>
        </div>
      </div>
    </header>
  );
}
