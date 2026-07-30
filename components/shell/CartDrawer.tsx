'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { getProduct } from '@/lib/data/products';
import { FREE_SHIPPING_FROM, useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { money, pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { LinkButton } from '@/components/ui/Button';

const EASE = [0.16, 1, 0.3, 1] as const;

export function CartDrawer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { cartOpen, closeCart } = useUi();
  const cart = useCart();
  const [codeInput, setCodeInput] = useState('');

  const missing = Math.max(FREE_SHIPPING_FROM - (cart.subtotal - cart.discount), 0);
  const progress = Math.min((cart.subtotal - cart.discount) / FREE_SHIPPING_FROM, 1);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            type="button"
            className="scrim"
            aria-label={dict.common.close}
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
          />
          <motion.aside
            className="drawer"
            aria-label={dict.cart.title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.56, ease: EASE }}
          >
            <header className="drawer__head">
              <div>
                <span className="eyebrow eyebrow--bare mono">{dict.nav.cart}</span>
                <h2 className="drawer__title">{dict.cart.title}</h2>
              </div>
              <button type="button" className="drawer__close" onClick={closeCart} aria-label={dict.common.close}>
                <span />
                <span />
              </button>
            </header>

            {cart.lines.length === 0 ? (
              <div className="drawer__empty">
                <div className="drawer__emptyArt">
                  <ProductArt variant="ring" hue={38} chroma={0.06} seed="empty" detail={false} />
                </div>
                <h3>{dict.cart.empty}</h3>
                <p>{dict.cart.emptyBody}</p>
                <LinkButton href={href('/catalogo', locale)} variant="ink" onClick={closeCart}>
                  {dict.cart.goCatalog}
                </LinkButton>
              </div>
            ) : (
              <>
                <div className="drawer__ship">
                  <div className="drawer__shipBar">
                    <span style={{ transform: `scaleX(${progress})` }} />
                  </div>
                  <p className="mono">
                    {missing > 0
                      ? `${dict.cart.missingForFree} ${money(missing, locale)} · ${dict.cart.freeShipping}`
                      : dict.cart.freeShipping}
                  </p>
                </div>

                <ul className="drawer__lines">
                  <AnimatePresence initial={false}>
                    {cart.lines.map((line) => {
                      const product = getProduct(line.slug);
                      if (!product) return null;
                      return (
                        <motion.li
                          key={line.slug}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="line"
                          style={{ ['--accent' as string]: `oklch(61% ${product.chroma} ${product.hue})` }}
                        >
                          <Link
                            href={`${href('/catalogo', locale)}/${product.slug}`}
                            className="line__art"
                            onClick={closeCart}
                          >
                            <ProductArt
                              variant={product.art}
                              hue={product.hue}
                              chroma={product.chroma}
                              seed={product.slug}
                              detail={false}
                            />
                          </Link>
                          <div className="line__body">
                            <span className="line__code mono">{product.code}</span>
                            <strong className="line__name">{pick(product.name, locale)}</strong>
                            <span className="line__unit">{pick(product.unit, locale)}</span>
                            <div className="line__foot">
                              <div className="stepper">
                                <button
                                  type="button"
                                  onClick={() => cart.setQty(line.slug, line.qty - 1)}
                                  aria-label="-"
                                >
                                  −
                                </button>
                                <span className="num">{line.qty}</span>
                                <button
                                  type="button"
                                  onClick={() => cart.setQty(line.slug, line.qty + 1)}
                                  aria-label="+"
                                >
                                  +
                                </button>
                              </div>
                              <span className="line__price num">{money(product.price * line.qty, locale)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="line__remove mono"
                            onClick={() => cart.remove(line.slug)}
                          >
                            {dict.common.remove}
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="drawer__code">
                  <input
                    className="field__input"
                    placeholder={dict.cart.code}
                    value={codeInput}
                    onChange={(event) => setCodeInput(event.target.value)}
                    aria-label={dict.cart.code}
                  />
                  <button type="button" className="btn btn--outline btn--sm" onClick={() => cart.applyCode(codeInput)}>
                    <span className="btn__label">{dict.cart.apply}</span>
                  </button>
                </div>
                {cart.code ? <p className="drawer__note drawer__note--ok mono">{dict.cart.codeOk}: {cart.code}</p> : null}
                {cart.codeError ? <p className="drawer__note drawer__note--bad mono">{dict.cart.codeBad}</p> : null}

                <footer className="drawer__foot">
                  <dl className="totals">
                    <div>
                      <dt>{dict.common.subtotal}</dt>
                      <dd className="num">{money(cart.subtotal, locale)}</dd>
                    </div>
                    {cart.discount > 0 ? (
                      <div>
                        <dt>{dict.common.discount}</dt>
                        <dd className="num">-{money(cart.discount, locale)}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>{dict.common.shipping}</dt>
                      <dd className="num">{cart.shipping === 0 ? dict.common.free : money(cart.shipping, locale)}</dd>
                    </div>
                    <div className="totals__grand">
                      <dt>{dict.common.total}</dt>
                      <dd className="num">{money(cart.total, locale)}</dd>
                    </div>
                  </dl>
                  <LinkButton href={href('/checkout', locale)} full onClick={closeCart}>
                    {dict.common.checkout}
                  </LinkButton>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
