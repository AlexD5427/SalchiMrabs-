'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { products } from '@/lib/data/products';
import type { ProductCategory } from '@/lib/types';
import { pick } from '@/lib/utils/format';
import { ProductCard } from './ProductCard';

type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'heat' | 'smoke';

const CATEGORIES: Array<ProductCategory> = ['ahumadas', 'frescas', 'curadas', 'vegetal'];

export function CatalogBrowser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const inCategory = category === 'all' || product.category === category;
      if (!inCategory) return false;
      if (!term) return true;
      return (
        pick(product.name, locale).toLowerCase().includes(term) ||
        pick(product.tagline, locale).toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term)
      );
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'heat':
        sorted.sort((a, b) => b.heat - a.heat);
        break;
      case 'smoke':
        sorted.sort((a, b) => b.smoke - a.smoke);
        break;
      default:
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return sorted;
  }, [category, query, sort, locale]);

  const dirty = category !== 'all' || query !== '' || sort !== 'featured';

  return (
    <div className="browser">
      <div className="browser__bar">
        <div className="browser__chips" role="tablist" aria-label={dict.common.filters}>
          <button
            type="button"
            role="tab"
            aria-selected={category === 'all'}
            className="chip"
            data-active={category === 'all' ? 'true' : 'false'}
            onClick={() => setCategory('all')}
          >
            {dict.catalog.all}
            <span className="chip__count num">{products.length}</span>
          </button>
          {CATEGORIES.map((key) => {
            const total = products.filter((product) => product.category === key).length;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={category === key}
                className="chip"
                data-active={category === key ? 'true' : 'false'}
                onClick={() => setCategory(key)}
              >
                {dict.catalog.categories[key]}
                <span className="chip__count num">{total}</span>
              </button>
            );
          })}
        </div>

        <div className="browser__tools">
          <label className="browser__search">
            <span className="sr-only">{dict.common.search}</span>
            <input
              type="search"
              value={query}
              placeholder={dict.common.search}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="browser__sort">
            <span className="sr-only">{dict.common.sort}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              <option value="featured">{dict.catalog.sort.featured}</option>
              <option value="priceAsc">{dict.catalog.sort.priceAsc}</option>
              <option value="priceDesc">{dict.catalog.sort.priceDesc}</option>
              <option value="heat">{dict.catalog.sort.heat}</option>
              <option value="smoke">{dict.catalog.sort.smoke}</option>
            </select>
          </label>

          <div className="browser__view">
            <button
              type="button"
              data-active={view === 'grid' ? 'true' : 'false'}
              onClick={() => setView('grid')}
            >
              {dict.catalog.view.grid}
            </button>
            <button
              type="button"
              data-active={view === 'list' ? 'true' : 'false'}
              onClick={() => setView('list')}
            >
              {dict.catalog.view.list}
            </button>
          </div>
        </div>
      </div>

      <div className="browser__status">
        <span className="mono">
          {visible.length} {dict.common.results}
        </span>
        {dirty ? (
          <button
            type="button"
            className="browser__clear mono"
            onClick={() => {
              setCategory('all');
              setQuery('');
              setSort('featured');
            }}
          >
            {dict.common.clear}
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="browser__empty">
          <h3>{dict.common.empty}</h3>
          <p>{dict.common.emptyHint}</p>
        </div>
      ) : (
        <motion.div className="browser__results" data-view={view} layout>
          <AnimatePresence mode="popLayout">
            {visible.map((product, index) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard
                  product={product}
                  locale={locale}
                  dict={dict}
                  index={index}
                  layout={view === 'list' ? 'list' : 'grid'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
