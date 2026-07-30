'use client';

import Link from 'next/link';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';

/** Mobile-only action bar: the phone layout gets thumb-reach navigation. */
export function MobileBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { openCart, toggleMenu } = useUi();
  const { count } = useCart();

  return (
    <nav className="mobilebar" aria-label={dict.nav.index}>
      <Link href={href('/catalogo', locale)} className="mobilebar__item">
        {dict.nav.catalog}
      </Link>
      <Link href={href('/reservas', locale)} className="mobilebar__item">
        {dict.nav.reserve}
      </Link>
      <button type="button" className="mobilebar__item" onClick={openCart}>
        {dict.nav.cart}
        <span className="mobilebar__count num" data-filled={count > 0 ? 'true' : 'false'}>
          {count}
        </span>
      </button>
      <button type="button" className="mobilebar__item mobilebar__item--accent" onClick={toggleMenu}>
        {dict.nav.menu}
      </button>
    </nav>
  );
}
