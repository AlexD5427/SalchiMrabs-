'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getProduct } from '@/lib/data/products';
import type { CartLine } from '@/lib/types';
import { readLocal, writeLocal } from '@/lib/utils/storage';

const STORAGE_KEY = 'salchimrabs.cart.v1';

export const FREE_SHIPPING_FROM = 350;
export const SHIPPING_FLAT = 25;

const CODES: Record<string, { off: number; min: number }> = {
  BRASA10: { off: 0.1, min: 0 },
  HUMO20: { off: 0.2, min: 250 },
  CLUB15: { off: 0.15, min: 150 },
};

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  code: string | null;
  codeError: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  applyCode: (code: string) => boolean;
  clearCode: () => void;
  has: (slug: string) => boolean;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [code, setCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readLocal<{ lines: CartLine[]; code: string | null }>(STORAGE_KEY, {
      lines: [],
      code: null,
    });
    setLines(stored.lines ?? []);
    setCode(stored.code ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeLocal(STORAGE_KEY, { lines, code });
  }, [lines, code, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug ? { ...line, qty: Math.min(line.qty + qty, 24) } : line,
        );
      }
      return [...current, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) => (line.slug === slug ? { ...line, qty: Math.min(qty, 24) } : line)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setCode(null);
  }, []);

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = getProduct(line.slug);
        return product ? sum + product.price * line.qty : sum;
      }, 0),
    [lines],
  );

  const discount = useMemo(() => {
    if (!code) return 0;
    const rule = CODES[code];
    if (!rule || subtotal < rule.min) return 0;
    return Math.round(subtotal * rule.off);
  }, [code, subtotal]);

  const shipping = useMemo(() => {
    if (lines.length === 0) return 0;
    return subtotal - discount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
  }, [lines.length, subtotal, discount]);

  const applyCode = useCallback(
    (input: string) => {
      const key = input.trim().toUpperCase();
      const rule = CODES[key];
      if (!rule || subtotal < rule.min) {
        setCodeError(true);
        window.setTimeout(() => setCodeError(false), 2600);
        return false;
      }
      setCode(key);
      setCodeError(false);
      return true;
    },
    [subtotal],
  );

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal,
      shipping,
      discount,
      total: Math.max(subtotal - discount + shipping, 0),
      code,
      codeError,
      add,
      setQty,
      remove,
      clear,
      applyCode,
      clearCode: () => setCode(null),
      has: (slug: string) => lines.some((line) => line.slug === slug),
    }),
    [lines, subtotal, shipping, discount, code, codeError, add, setQty, remove, clear, applyCode],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
