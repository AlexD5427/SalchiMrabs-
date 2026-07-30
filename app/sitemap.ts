import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { products } from '@/lib/data/products';
import { recipes } from '@/lib/data/recipes';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://salchimrabs.vercel.app';
  const routes = ['', '/catalogo', '/recetas', '/clientes', '/club', '/taller', '/reservas', '/faq', '/cuenta'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({ url: `${base}/${locale}${route}`, changeFrequency: 'weekly', priority: route === '' ? 1 : 0.7 });
    }
    for (const product of products) {
      entries.push({ url: `${base}/${locale}/catalogo/${product.slug}`, changeFrequency: 'weekly', priority: 0.8 });
    }
    for (const recipe of recipes) {
      entries.push({ url: `${base}/${locale}/recetas/${recipe.slug}`, changeFrequency: 'monthly', priority: 0.6 });
    }
  }

  return entries;
}
