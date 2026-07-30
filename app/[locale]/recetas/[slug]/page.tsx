import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { href, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getRecipe, recipes } from '@/lib/data/recipes';
import { getProduct } from '@/lib/data/products';
import { money, pick } from '@/lib/utils/format';
import { ProductArt } from '@/components/art/ProductArt';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';
import { LinkButton } from '@/components/ui/Button';

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  return { title: pick(recipe.title, locale as Locale), description: pick(recipe.intro, locale as Locale) };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const recipe = getRecipe(slug);
  if (!recipe) notFound();
  const product = getProduct(recipe.productSlug);

  return (
    <article className="recipe" style={{ ['--accent' as string]: `oklch(62% 0.15 ${recipe.hue})` }}>
      <header className="recipe__head" data-tone="ink">
        <div className="wrap recipe__headGrid">
          <div>
            <div className="recipe__crumbs mono">
              <Link href={href('/recetas', locale)}>{dict.recipes.title}</Link>
              <span aria-hidden="true">/</span>
              <span>{pick(recipe.kicker, locale)}</span>
            </div>
            <SplitText as="h1" className="display recipe__title" text={pick(recipe.title, locale)} immediate delay={0.1} />
            <p className="lede">{pick(recipe.intro, locale)}</p>

            <dl className="recipe__facts">
              <div>
                <dt className="mono">{dict.recipes.time}</dt>
                <dd className="num">
                  {recipe.minutes} {dict.recipes.minutes}
                </dd>
              </div>
              <div>
                <dt className="mono">{dict.recipes.servings}</dt>
                <dd className="num">{recipe.servings}</dd>
              </div>
              <div>
                <dt className="mono">{dict.recipes.level}</dt>
                <dd>{pick(recipe.level, locale)}</dd>
              </div>
            </dl>
          </div>

          {product ? (
            <div className="recipe__art" aria-hidden="true">
              <ProductArt variant={product.art} hue={recipe.hue} chroma={0.15} seed={recipe.slug} />
            </div>
          ) : null}
        </div>
      </header>

      <section className="section recipe__body">
        <div className="wrap recipe__grid">
          <div className="recipe__ingredients">
            <span className="eyebrow">{dict.recipes.ingredients}</span>
            <ul>
              {recipe.ingredients.map((item) => (
                <li key={item.es}>{pick(item, locale)}</li>
              ))}
            </ul>

            {product ? (
              <div className="recipe__product">
                <span className="mono">{dict.recipes.useProduct}</span>
                <strong>{pick(product.name, locale)}</strong>
                <span className="num">{money(product.price, locale)}</span>
                <LinkButton
                  href={`${href('/catalogo', locale)}/${product.slug}`}
                  variant="outline"
                  size="sm"
                >
                  {dict.common.viewProduct}
                </LinkButton>
              </div>
            ) : null}
          </div>

          <ol className="recipe__steps">
            <span className="eyebrow">{dict.recipes.steps}</span>
            {recipe.steps.map((step, index) => (
              <Reveal key={step.es} delay={index * 0.05} from="up" distance={22}>
                <li>
                  <span className="recipe__stepN num">{String(index + 1).padStart(2, '0')}</span>
                  <p>{pick(step, locale)}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </article>
  );
}
