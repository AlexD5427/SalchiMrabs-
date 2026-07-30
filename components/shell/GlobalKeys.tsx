'use client';

import { useEffect } from 'react';
import { useUi } from '@/lib/store/ui';

/** Escape closes whatever is open. Cheap, global, expected. */
export function GlobalKeys() {
  const { menuOpen, cartOpen, closeMenu, closeCart } = useUi();

  useEffect(() => {
    if (!menuOpen && !cartOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (cartOpen) closeCart();
      else if (menuOpen) closeMenu();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, cartOpen, closeMenu, closeCart]);

  return null;
}
