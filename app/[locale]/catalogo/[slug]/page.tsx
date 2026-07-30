import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { href, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getProduct, products } from '@/lib/data/products';
import { recipesForProduct } from '@/lib/data/recipes';
import { money, pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { Turntable } from '@/components/three/Turntable';
import { ProductBuy } from '@/components/shop/ProductBuy';
import { ProductCard } from '@/components/shop/ProductCard';
import { Meter } from '@/components/ui/Meter';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const typed = locale as Locale;
  return {
    title: pick(product.name, typed),
    description: pick(product.tagline, typed),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 3);
  const fallbackRelated = related.length > 0 ? related : products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const linked = recipesForProduct(product.slug);

  const accent = {
    ['--accent' as string]: `oklch(61% ${product.chroma} ${product.hue})`,
    ['--accent-deep' as string]: `oklch(45% ${product.chroma * 0.9} ${product.hue})`,
    ['--accent-lift' as string]: `oklch(76% ${product.chroma * 0.8} ${product.hue + 8})`,
  };

  return (
    <article className="pdp" style={accent}>
      <section className="pdp__hero" data-tone="ink">
        <div className="wrap pdp__heroGrid">
          <div className="pdp__stage">
            <div className="pdp__stageArt" aria-hidden="true">
              <ProductArt variant={product.art} hue={product.hue} chroma={product.chroma} seed={product.slug} />
            </div>
            <Turntable hue={product.hue} chroma={product.chroma} className="pdp__three" />
            <span className="pdp__rotate mono">{dict.product.rotate}</span>
          </div>

          <div className="pdp__intro">
            <div className="pdp__crumbs mono">
              <Link href={href('/catalogo', locale)}>{dict.catalog.title}</Link>
              <span aria-hidden="true">/</span>
              <span>{dict.catalog.categories[product.category]}</span>
              <span aria-hidden="true">/</span>
              <span>{product.code}</span>
            </div>

            <SplitText as="h1" className="pdp__name" text={pick(product.name, locale)} immediate delay={0.1} />
            <p className="pdp__tagline lede">{pick(product.tagline, locale)}</p>

            <div className="pdp__meters">
              <Meter label={dict.catalog.heatLabel} value={product.heat} tone="heat" />
              <Meter label={dict.catalog.smokeLabel} value={product.smoke} tone="smoke" />
              <span className="pdp__stock mono" data-low={product.stock <= 12 ? 'true' : 'false'}>
                {product.stock <= 12 ? `${dict.common.lastUnits} · ${product.stock}` : dict.common.inStock}
              </span>
            </div>

            <ProductBuy product={product} locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      <section className="section pdp__story">
        <div className="wrap pdp__storyGrid">
          <div>
            <span className="eyebrow">{dict.product.spec}</span>
            <p className="pdp__prose">{pick(product.story, locale)}</p>

            <div className="pdp__notes">
              <span className="mono">{dict.product.tasting}</span>
              <ul>
                {product.notes.map((note) => (
                  <li key={note.es}>{pick(note, locale)}</li>
                ))}
              </ul>
            </div>
          </div>

          <dl className="spec">
            <div>
              <dt>{dict.product.unit}</dt>
              <dd>{pick(product.unit, locale)}</dd>
            </div>
            <div>
              <dt>{dict.product.origin}</dt>
              <dd>{pick(product.origin, locale)}</dd>
            </div>
            <div>
              <dt>{dict.product.cure}</dt>
              <dd className="num">
                {product.cure} {dict.product.days}
              </dd>
            </div>
            <div>
              <dt>{dict.product.pairings}</dt>
              <dd>{product.pairings.map((pair) => pick(pair, locale)).join(' · ')}</dd>
            </div>
            <div>
              <dt>{dict.product.allergens}</dt>
              <dd>{pick(product.allergens, locale)}</dd>
            </div>
            <div>
              <dt>{dict.catalog.title}</dt>
              <dd className="num">{money(product.price, locale)}</dd>
            </div>
          </dl>
        </div>
      </section>

      {linked.length > 0 ? (
        <section className="section pdp__recipes" data-tone="ink">
          <div className="wrap">
            <span className="eyebrow">{dict.product.recipeWith}</span>
            <ul className="pdp__recipeList">
              {linked.map((recipe) => (
                <li key={recipe.slug}>
                  <Link href={`${href('/recetas', locale)}/${recipe.slug}`}>
                    <strong>{pick(recipe.title, locale)}</strong>
                    <span className="mono">{pick(recipe.kicker, locale)}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section pdp__related">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">{dict.product.related}</span>
          </Reveal>
          <div className="pdp__relatedGrid">
            {fallbackRelated.map((item, index) => (
              <ProductCard key={item.slug} product={item} locale={locale} dict={dict} index={index} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
