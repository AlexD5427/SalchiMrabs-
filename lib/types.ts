import type { Locale } from './i18n/config';

export type Localized = Record<Locale, string>;

export type ArtVariant = 'coil' | 'link' | 'curve' | 'twin' | 'sliced' | 'skewer' | 'board' | 'ring';

export type ProductCategory = 'ahumadas' | 'frescas' | 'curadas' | 'vegetal';

export interface Product {
  slug: string;
  code: string;
  name: Localized;
  tagline: Localized;
  story: Localized;
  notes: Localized[];
  pairings: Localized[];
  origin: Localized;
  allergens: Localized;
  unit: Localized;
  badge?: Localized;
  category: ProductCategory;
  price: number;
  heat: 0 | 1 | 2 | 3;
  smoke: 0 | 1 | 2 | 3;
  cure: number;
  hue: number;
  chroma: number;
  art: ArtVariant;
  stock: number;
  featured?: boolean;
}

export interface Recipe {
  slug: string;
  title: Localized;
  kicker: Localized;
  intro: Localized;
  minutes: number;
  servings: number;
  level: Localized;
  ingredients: Localized[];
  steps: Localized[];
  productSlug: string;
  hue: number;
}

export interface CartLine {
  slug: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: number;
  lines: Array<CartLine & { price: number; name: Localized }>;
  total: number;
  payment: string;
  delivery: string;
}

export interface Reservation {
  id: string;
  createdAt: number;
  type: string;
  date: string;
  time: string;
  people: number;
  notes?: string;
}
