'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { useUi } from '@/lib/store/ui';
import { products } from '@/lib/data/products';
import { shops } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { LocaleSwitch } from './LocaleSwitch';

const EASE = [0.16, 1, 0.3, 1] as const;

export function MenuOverlay({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { menuOpen, closeMenu, setAccent, resetAccent } = useUi();
  const [preview, setPreview] = useState(0);

  const entries: Array<{ path: string; label: string; note: string }> = [
    { path: '/catalogo', label: dict.nav.catalog, note: `${products.length}` },
    { path: '/recetas', label: dict.nav.recipes, note: '05' },
    { path: '/taller', label: dict.nav.workshop, note: '2014' },
    { path: '/club', label: dict.nav.club, note: '03' },
    { path: '/clientes', label: dict.nav.clients, note: '30+' },
    { path: '/reservas', label: dict.nav.reserve, note: '48h' },
    { path: '/cuenta', label: dict.nav.account, note: '' },
    { path: '/faq', label: dict.nav.faq, note: '' },
  ];

  const highlight = products[preview] ?? products[0];

  return (
    <AnimatePresence>
      {menuOpen ? (
        <motion.div
          className="menu"
          data-tone="ink"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.72, ease: EASE }}
        >
          <div className="menu__grid">
            <div className="menu__list">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.path}
                  initial={{ y: 46, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.16 + index * 0.05, duration: 0.8, ease: EASE }}
                >
                  <Link
                    href={href(entry.path, locale)}
                    className="menu__link"
                    onClick={closeMenu}
                    onMouseEnter={() => {
                      const product = products[index % products.length];
                      setPreview(index % products.length);
                      setAccent(product.hue, product.chroma);
                    }}
                    onMouseLeave={resetAccent}
                  >
                    <span className="menu__linkIndex mono">{String(index + 1).padStart(2, '0')}</span>
                    <span className="menu__linkLabel">{entry.label}</span>
                    {entry.note ? <span className="menu__linkNote mono">{entry.note}</span> : null}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.aside
              className="menu__aside"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.9, ease: EASE }}
            >
              <div className="menu__preview">
                <ProductArt
                  variant={highlight.art}
                  hue={highlight.hue}
                  chroma={highlight.chroma}
                  seed={highlight.slug}
                />
                <div className="menu__previewMeta">
                  <span className="mono">{highlight.code}</span>
                  <strong>{pick(highlight.name, locale)}</strong>
                </div>
              </div>

              <div className="menu__shops">
                {shops.slice(0, 3).map((shop) => (
                  <div key={shop.name} className="menu__shop">
                    <strong>{shop.name}</strong>
                    <span>{pick(shop.address, locale)}</span>
                    <span className="mono">{pick(shop.hours, locale)}</span>
                  </div>
                ))}
              </div>

              <div className="menu__footer">
                <LocaleSwitch locale={locale} />
                <a className="menu__mail" href="mailto:hola@salchimrabs.bo">
                  hola@salchimrabs.bo
                </a>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
