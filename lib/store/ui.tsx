'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { accentVars } from '@/lib/utils/format';

interface Toast {
  id: number;
  text: string;
  tone: 'ember' | 'plain';
}

interface UiState {
  menuOpen: boolean;
  cartOpen: boolean;
  booted: boolean;
  toasts: Toast[];
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  openCart: () => void;
  closeCart: () => void;
  setBooted: (value: boolean) => void;
  toast: (text: string, tone?: Toast['tone']) => void;
  dismiss: (id: number) => void;
  /** Repaints the global accent. This is the "dynamic color" engine. */
  setAccent: (hue: number, chroma?: number) => void;
  resetAccent: () => void;
}

const UiContext = createContext<UiState | null>(null);

const BASE_ACCENT = { hue: 42, chroma: 0.185 };

export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const setAccent = useCallback((hue: number, chroma = 0.16) => {
    const root = document.documentElement;
    const vars = accentVars(hue, chroma);
    for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value);
  }, []);

  const resetAccent = useCallback(() => {
    setAccent(BASE_ACCENT.hue, BASE_ACCENT.chroma);
  }, [setAccent]);

  const toast = useCallback((text: string, tone: Toast['tone'] = 'ember') => {
    const id = ++counter.current;
    setToasts((current) => [...current, { id, text, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3600);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    document.body.dataset.locked = menuOpen || cartOpen ? 'true' : 'false';
  }, [menuOpen, cartOpen]);

  const value = useMemo<UiState>(
    () => ({
      menuOpen,
      cartOpen,
      booted,
      toasts,
      openMenu: () => setMenuOpen(true),
      closeMenu: () => setMenuOpen(false),
      toggleMenu: () => setMenuOpen((v) => !v),
      openCart: () => {
        setMenuOpen(false);
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      setBooted,
      toast,
      dismiss,
      setAccent,
      resetAccent,
    }),
    [menuOpen, cartOpen, booted, toasts, toast, dismiss, setAccent, resetAccent],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiState {
  const context = useContext(UiContext);
  if (!context) throw new Error('useUi must be used inside <UiProvider>');
  return context;
}
