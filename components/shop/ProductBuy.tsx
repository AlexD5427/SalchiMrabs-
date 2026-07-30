'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { money, pick } from '@/lib/utils/format';
import { Button, LinkButton } from '@/components/ui/Button';

export function ProductBuy({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const cart = useCart();
  const { toast, openCart } = useUi();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<'idle' | 'added'>('idle');

  const add = () => {
    cart.add(product.slug, qty);
    setState('added');
    toast(`${pick(product.name, locale)} ${dict.toast.added}`);
    window.setTimeout(() => setState('idle'), 1800);
  };

  return (
    <div className="buy">
      <div className="buy__row">
        <span className="buy__price num">{money(product.price * qty, locale)}</span>
        <div className="stepper stepper--lg">
          <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="-">
            −
          </button>
          <span className="num">{qty}</span>
          <button type="button" onClick={() => setQty((value) => Math.min(12, value + 1))} aria-label="+">
            +
          </button>
        </div>
      </div>

      <div className="buy__actions">
        <Button onClick={add} size="lg" full magnetic>
          {state === 'added' ? dict.common.added : dict.common.addToCart}
        </Button>
        <Button
          variant="ink"
          size="lg"
          full
          onClick={() => {
            cart.add(product.slug, qty);
            router.push(href('/checkout', locale));
          }}
        >
          {dict.common.buyNow}
        </Button>
      </div>

      <div className="buy__minor">
        <LinkButton href={href('/reservas', locale)} variant="ghost" size="sm">
          {dict.common.reserve}
        </LinkButton>
        <button type="button" className="buy__cartLink mono" onClick={openCart}>
          {dict.cart.title} · {cart.count}
        </button>
      </div>

      <p className="buy__hint mono">{dict.product.reserveHint}</p>
    </div>
  );
}
