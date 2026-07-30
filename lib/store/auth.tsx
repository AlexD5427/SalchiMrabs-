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
import type { Order, Reservation } from '@/lib/types';
import { readLocal, writeLocal } from '@/lib/utils/storage';

const USERS_KEY = 'salchimrabs.users.v1';
const SESSION_KEY = 'salchimrabs.session.v1';
const ORDERS_KEY = 'salchimrabs.orders.v1';
const RESERVATIONS_KEY = 'salchimrabs.reservations.v1';

interface StoredUser {
  email: string;
  name: string;
  secret: string;
}

export interface SessionUser {
  email: string;
  name: string;
}

export type AuthError = 'wrong' | 'taken' | 'weak' | null;

interface AuthState {
  user: SessionUser | null;
  orders: Order[];
  reservations: Reservation[];
  error: AuthError;
  signIn: (email: string, password: string) => boolean;
  signUp: (name: string, email: string, password: string) => boolean;
  signOut: () => void;
  addOrder: (order: Order) => void;
  addReservation: (reservation: Reservation) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

/** Not cryptography: a demo-only obfuscation so the browser never stores raw text. */
function scramble(value: string): string {
  return typeof window === 'undefined' ? value : window.btoa(unescape(encodeURIComponent(value)));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<AuthError>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(readLocal<SessionUser | null>(SESSION_KEY, null));
    setOrders(readLocal<Order[]>(ORDERS_KEY, []));
    setReservations(readLocal<Reservation[]>(RESERVATIONS_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeLocal(SESSION_KEY, user);
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeLocal(ORDERS_KEY, orders);
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeLocal(RESERVATIONS_KEY, reservations);
  }, [reservations, hydrated]);

  const signIn = useCallback((email: string, password: string) => {
    const users = readLocal<StoredUser[]>(USERS_KEY, []);
    const found = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.trim().toLowerCase() &&
        candidate.secret === scramble(password),
    );
    if (!found) {
      setError('wrong');
      return false;
    }
    setError(null);
    setUser({ email: found.email, name: found.name });
    return true;
  }, []);

  const signUp = useCallback((name: string, email: string, password: string) => {
    if (password.length < 6) {
      setError('weak');
      return false;
    }
    const users = readLocal<StoredUser[]>(USERS_KEY, []);
    const clean = email.trim().toLowerCase();
    if (users.some((candidate) => candidate.email.toLowerCase() === clean)) {
      setError('taken');
      return false;
    }
    const next: StoredUser = { email: clean, name: name.trim() || clean, secret: scramble(password) };
    writeLocal(USERS_KEY, [...users, next]);
    setError(null);
    setUser({ email: next.email, name: next.name });
    return true;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      orders,
      reservations,
      error,
      signIn,
      signUp,
      signOut: () => setUser(null),
      addOrder: (order: Order) => setOrders((current) => [order, ...current]),
      addReservation: (reservation: Reservation) =>
        setReservations((current) => [reservation, ...current]),
      clearError: () => setError(null),
    }),
    [user, orders, reservations, error, signIn, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
