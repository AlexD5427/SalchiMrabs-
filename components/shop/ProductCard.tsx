'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { money, pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { Meter } from '@/components/ui/Meter';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  index?: number;
  layout?: 'rail' | 'grid' | 'list';
}

export function ProductCard({ product, locale, dict, index = 0, layout = 'grid' }: ProductCardProps) {
  const cart = useCart();
  const { toast, setAccent, resetAccent } = useUi();
  const link = `${href('/catalogo', locale)}/${product.slug}`;
  const low = product.stock <= 12;

  return (
    <motion.article
      className="pcard"
      data-layout={layout}
      style={{
        ['--accent' as string]: `oklch(61% ${product.chroma} ${product.hue})`,
        ['--accent-deep' as string]: `oklch(44% ${product.chroma * 0.9} ${product.hue})`,
      }}
      onMouseEnter={() => setAccent(product.hue, product.chroma)}
      onMouseLeave={resetAccent}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={link} className="pcard__media" data-cursor={dict.common.viewProduct}>
        <span className="pcard__index mono">{product.code}</span>
        <ProductArt
          variant={product.art}
          hue={product.hue}
          chroma={product.chroma}
          seed={product.slug}
          className="pcard__art"
        />
        {product.badge ? <span className="pcard__badge">{pick(product.badge, locale)}</span> : null}
      </Link>

      <div className="pcard__body">
        <div className="pcard__head">
          <h3 className="pcard__name">
            <Link href={link}>{pick(product.name, locale)}</Link>
          </h3>
          <span className="pcard__price num">{money(product.price, locale)}</span>
        </div>

        <p className="pcard__tagline">{pick(product.tagline, locale)}</p>

        <div className="pcard__meters">
          <Meter label={dict.catalog.heatLabel} value={product.heat} tone="heat" />
          <Meter label={dict.catalog.smokeLabel} value={product.smoke} tone="smoke" />
        </div>

        <div className="pcard__foot">
          <span className="pcard__unit mono">{pick(product.unit, locale)}</span>
          <button
            type="button"
            className="pcard__add"
            onClick={() => {
              cart.add(product.slug);
              toast(`${pick(product.name, locale)} ${dict.toast.added}`);
            }}
          >
            <span>{dict.catalog.quickAdd}</span>
            <span className="pcard__addIcon" aria-hidden="true">
              +
            </span>
          </button>
        </div>

        {low ? <span className="pcard__stock mono">{dict.common.lastUnits} · {product.stock}</span> : null}
      </div>
    </motion.article>
  );
}
