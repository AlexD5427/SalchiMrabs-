'use client';

import Link from 'next/link';
import { useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { recipes } from '@/lib/data/recipes';
import { getProduct } from '@/lib/data/products';
import { pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { SplitText } from '@/components/motion/SplitText';
import { LinkButton } from '@/components/ui/Button';

export function RecipeStrip({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section className="section recipes-strip">
      <div className="wrap recipes-strip__head">
        <div>
          <span className="eyebrow">{dict.home.recipesEyebrow}</span>
          <SplitText as="h2" className="title" text={dict.home.recipesTitle} />
        </div>
        <LinkButton href={href('/recetas', locale)} variant="outline" size="sm">
          {dict.common.viewAll}
        </LinkButton>
      </div>

      <div className="wrap">
        <ul className="rlist">
          {recipes.map((recipe, index) => {
            const product = getProduct(recipe.productSlug);
            const active = hover === recipe.slug;
            return (
              <li
                className="rlist__row"
                key={recipe.slug}
                data-active={active ? 'true' : 'false'}
                style={{ ['--accent' as string]: `oklch(61% 0.16 ${recipe.hue})` }}
                onMouseEnter={() => setHover(recipe.slug)}
                onMouseLeave={() => setHover(null)}
              >
                <Link href={`${href('/recetas', locale)}/${recipe.slug}`} className="rlist__link">
                  <span className="rlist__index mono">{String(index + 1).padStart(2, '0')}</span>
                  <span className="rlist__title">{pick(recipe.title, locale)}</span>
                  <span className="rlist__kicker mono">{pick(recipe.kicker, locale)}</span>
                  <span className="rlist__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                {product ? (
                  <span className="rlist__art" aria-hidden="true">
                    <ProductArt
                      variant={product.art}
                      hue={product.hue}
                      chroma={product.chroma}
                      seed={product.slug}
                      detail={false}
                    />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
