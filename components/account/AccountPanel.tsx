'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { useAuth } from '@/lib/store/auth';
import { useUi } from '@/lib/store/ui';
import { formatDate, money, pick } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';

const EASE = [0.16, 1, 0.3, 1] as const;

export function AccountPanel({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const auth = useAuth();
  const { toast } = useUi();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (auth.user) {
    return (
      <div className="account">
        <header className="account__head">
          <div>
            <span className="eyebrow">{dict.account.welcome}</span>
            <h2 className="title">{auth.user.name}</h2>
            <p className="mono">{auth.user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              auth.signOut();
              toast(dict.account.signOut);
            }}
          >
            {dict.account.signOut}
          </Button>
        </header>

        <div className="account__grid">
          <section>
            <span className="eyebrow">{dict.account.orders}</span>
            {auth.orders.length === 0 ? (
              <p className="account__empty">{dict.account.noOrders}</p>
            ) : (
              <ul className="account__list">
                {auth.orders.map((order) => (
                  <li key={order.id}>
                    <div className="account__rowTop">
                      <strong className="num">{order.id}</strong>
                      <span className="num">{money(order.total, locale)}</span>
                    </div>
                    <span className="mono">
                      {formatDate(new Date(order.createdAt).toISOString(), locale)} ·{' '}
                      {dict.checkout.payment[order.payment as 'card' | 'qr' | 'transfer' | 'cash']}
                    </span>
                    <span className="account__items">
                      {order.lines.map((line) => `${pick(line.name, locale)} ×${line.qty}`).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <span className="eyebrow">{dict.account.reservations}</span>
            {auth.reservations.length === 0 ? (
              <p className="account__empty">{dict.account.noReservations}</p>
            ) : (
              <ul className="account__list">
                {auth.reservations.map((reservation) => (
                  <li key={reservation.id}>
                    <div className="account__rowTop">
                      <strong className="num">{reservation.id}</strong>
                      <span className="mono">
                        {dict.reserve.types[reservation.type as 'pickup' | 'tasting' | 'catering']}
                      </span>
                    </div>
                    <span className="mono">
                      {reservation.date} · {reservation.time} · {reservation.people}
                    </span>
                    {reservation.notes ? <span className="account__items">{reservation.notes}</span> : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="account__note mono">{dict.account.localNote}</p>
      </div>
    );
  }

  const errorText =
    auth.error === 'wrong'
      ? dict.account.wrong
      : auth.error === 'taken'
        ? dict.account.taken
        : auth.error === 'weak'
          ? dict.account.weak
          : undefined;

  return (
    <div className="auth">
      <div className="auth__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'in'}
          data-active={mode === 'in' ? 'true' : 'false'}
          onClick={() => {
            setMode('in');
            auth.clearError();
          }}
        >
          {dict.account.signIn}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'up'}
          data-active={mode === 'up' ? 'true' : 'false'}
          onClick={() => {
            setMode('up');
            auth.clearError();
          }}
        >
          {dict.account.signUp}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          className="form"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.38, ease: EASE }}
          onSubmit={(event) => {
            event.preventDefault();
            const ok =
              mode === 'in'
                ? auth.signIn(form.email, form.password)
                : auth.signUp(form.name, form.email, form.password);
            if (ok) toast(`${dict.account.welcome}, ${form.name || form.email}`);
          }}
          noValidate
        >
          {mode === 'up' ? (
            <Field
              label={dict.account.name}
              name="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          ) : null}
          <Field
            label={dict.account.email}
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <Field
            label={dict.account.password}
            name="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            error={errorText}
          />
          <Button type="submit" size="lg" full>
            {mode === 'in' ? dict.account.signIn : dict.account.signUp}
          </Button>
          <button
            type="button"
            className="auth__switch mono"
            onClick={() => {
              setMode(mode === 'in' ? 'up' : 'in');
              auth.clearError();
            }}
          >
            {mode === 'in' ? dict.account.noAccount : dict.account.hasAccount}
          </button>
          <p className="account__note mono">{dict.account.localNote}</p>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
