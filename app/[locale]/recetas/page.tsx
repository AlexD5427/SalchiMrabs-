import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { href } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { recipes } from '@/lib/data/recipes';
import { getProduct } from '@/lib/data/products';
import { pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { PageHead } from '@/components/sections/PageHead';
import { Reveal } from '@/components/motion/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.recipes.title, description: dict.recipes.lede };
}

export default async function RecipesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead
        eyebrow={dict.home.recipesEyebrow}
        title={dict.recipes.title}
        lede={dict.recipes.lede}
        hue={128}
        variant="table"
      />

      <section className="section">
        <div className="wrap rgrid">
          {recipes.map((recipe, index) => {
            const product = getProduct(recipe.productSlug);
            return (
              <Reveal key={recipe.slug} delay={index * 0.06}>
                <Link
                  href={`${href('/recetas', locale)}/${recipe.slug}`}
                  className="rcard"
                  style={{ ['--accent' as string]: `oklch(62% 0.15 ${recipe.hue})` }}
                >
                  <span className="rcard__index mono">{String(index + 1).padStart(2, '0')}</span>
                  {product ? (
                    <span className="rcard__art" aria-hidden="true">
                      <ProductArt
                        variant={product.art}
                        hue={recipe.hue}
                        chroma={0.15}
                        seed={recipe.slug}
                        detail={false}
                      />
                    </span>
                  ) : null}
                  <span className="rcard__kicker mono">{pick(recipe.kicker, locale)}</span>
                  <h2 className="rcard__title">{pick(recipe.title, locale)}</h2>
                  <p className="rcard__intro">{pick(recipe.intro, locale)}</p>
                  <span className="rcard__meta mono">
                    {recipe.minutes} {dict.recipes.minutes} · {recipe.servings} {dict.recipes.servings} ·{' '}
                    {pick(recipe.level, locale)}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
