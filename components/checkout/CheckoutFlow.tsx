'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { getProduct } from '@/lib/data/products';
import { FREE_SHIPPING_FROM, useCart } from '@/lib/store/cart';
import { useAuth } from '@/lib/store/auth';
import { useUi } from '@/lib/store/ui';
import { money, orderCode, pick } from '@/lib/utils/format';
import { Button, LinkButton } from '@/components/ui/Button';
import { Choice, Field, Select } from '@/components/ui/Field';
import { ProductArt } from '@/components/art/ProductArt';
import { PaymentQr } from './PaymentQr';

type DeliveryMethod = 'express' | 'national' | 'pickup';
type PaymentMethod = 'card' | 'qr' | 'transfer' | 'cash';

const EASE = [0.16, 1, 0.3, 1] as const;
const SLOTS = ['10:00 – 13:00', '13:00 – 16:00', '16:00 – 19:00', '19:00 – 21:00'];

export function CheckoutFlow({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cart = useCart();
  const { user, addOrder } = useAuth();
  const { toast } = useUi();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'editing' | 'processing' | 'done'>('editing');
  const [receipt, setReceipt] = useState<{ id: string; total: number } | null>(null);

  const [contact, setContact] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    city: 'La Paz',
    address: '',
    reference: '',
  });
  const [delivery, setDelivery] = useState<DeliveryMethod>('express');
  const [slot, setSlot] = useState(SLOTS[1]);
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = useMemo(() => {
    if (delivery === 'pickup') return 0;
    if (cart.subtotal - cart.discount >= FREE_SHIPPING_FROM) return 0;
    return delivery === 'national' ? 40 : 25;
  }, [delivery, cart.subtotal, cart.discount]);

  const total = Math.max(cart.subtotal - cart.discount + deliveryFee, 0);

  const steps = [dict.checkout.steps.data, dict.checkout.steps.delivery, dict.checkout.steps.payment];

  const validate = (index: number) => {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (!contact.name.trim()) next.name = dict.common.required;
      if (!contact.email.includes('@')) next.email = dict.common.required;
      if (!contact.phone.trim()) next.phone = dict.common.required;
    }
    if (index === 1 && delivery !== 'pickup' && !contact.address.trim()) {
      next.address = dict.common.required;
    }
    if (index === 2 && payment === 'card') {
      if (card.number.replace(/\s/g, '').length < 15) next.number = dict.common.required;
      if (!card.name.trim()) next.cardName = dict.common.required;
      if (card.expiry.length < 4) next.expiry = dict.common.required;
      if (card.cvc.length < 3) next.cvc = dict.common.required;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const pay = () => {
    if (!validate(2)) return;
    setStatus('processing');

    window.setTimeout(() => {
      const id = orderCode();
      addOrder({
        id,
        createdAt: Date.now(),
        lines: cart.lines.map((line) => {
          const product = getProduct(line.slug);
          return {
            ...line,
            price: product?.price ?? 0,
            name: product?.name ?? { es: line.slug, en: line.slug },
          };
        }),
        total,
        payment,
        delivery,
      });
      setReceipt({ id, total });
      cart.clear();
      setStatus('done');
      toast(dict.checkout.successTitle);
    }, 1700);
  };

  if (status === 'done' && receipt) {
    return (
      <div className="success">
        <span className="eyebrow">{dict.checkout.order}</span>
        <h2 className="display success__title">{dict.checkout.successTitle}</h2>
        <p className="lede">{dict.checkout.successBody}</p>
        <dl className="success__meta">
          <div>
            <dt className="mono">{dict.checkout.order}</dt>
            <dd className="num">{receipt.id}</dd>
          </div>
          <div>
            <dt className="mono">{dict.common.total}</dt>
            <dd className="num">{money(receipt.total, locale)}</dd>
          </div>
          <div>
            <dt className="mono">{dict.checkout.paymentMethod}</dt>
            <dd>{dict.checkout.payment[payment]}</dd>
          </div>
        </dl>
        <div className="success__actions">
          <LinkButton href={href('/catalogo', locale)} size="lg">
            {dict.checkout.keepShopping}
          </LinkButton>
          <LinkButton href={href('/cuenta', locale)} variant="outline" size="lg">
            {dict.account.orders}
          </LinkButton>
        </div>
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="success">
        <h2 className="title">{dict.checkout.emptyTitle}</h2>
        <p className="lede">{dict.cart.emptyBody}</p>
        <LinkButton href={href('/catalogo', locale)} size="lg">
          {dict.cart.goCatalog}
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__main">
        <ol className="steps" aria-label={dict.checkout.title}>
          {steps.map((label, index) => (
            <li key={label} data-state={index === step ? 'current' : index < step ? 'done' : 'next'}>
              <button
                type="button"
                onClick={() => {
                  if (index < step) setStep(index);
                }}
              >
                <span className="num">{String(index + 1).padStart(2, '0')}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="checkout__panel"
          >
            {step === 0 ? (
              <div className="form">
                <span className="eyebrow">{dict.checkout.contact}</span>
                <div className="form__grid">
                  <Field
                    label={dict.checkout.name}
                    name="name"
                    value={contact.name}
                    onChange={(event) => setContact({ ...contact, name: event.target.value })}
                    required
                    error={errors.name}
                  />
                  <Field
                    label={dict.checkout.email}
                    name="email"
                    type="email"
                    value={contact.email}
                    onChange={(event) => setContact({ ...contact, email: event.target.value })}
                    required
                    error={errors.email}
                  />
                  <Field
                    label={dict.checkout.phone}
                    name="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                    required
                    error={errors.phone}
                  />
                  <Select
                    label={dict.checkout.city}
                    name="city"
                    value={contact.city}
                    onChange={(event) => setContact({ ...contact, city: event.target.value })}
                  >
                    {['La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz', 'Sucre', 'Tarija'].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="form">
                <span className="eyebrow">{dict.checkout.deliveryMethod}</span>
                <div className="form__choices">
                  {(['express', 'national', 'pickup'] as const).map((method) => (
                    <Choice
                      key={method}
                      name="delivery"
                      value={method}
                      label={dict.checkout.delivery[method]}
                      checked={delivery === method}
                      onChange={(value) => setDelivery(value as DeliveryMethod)}
                      meta={
                        method === 'pickup'
                          ? dict.common.free
                          : cart.subtotal - cart.discount >= FREE_SHIPPING_FROM
                            ? dict.common.free
                            : money(method === 'national' ? 40 : 25, locale)
                      }
                    />
                  ))}
                </div>

                {delivery !== 'pickup' ? (
                  <div className="form__grid">
                    <Field
                      label={dict.checkout.address}
                      name="address"
                      value={contact.address}
                      onChange={(event) => setContact({ ...contact, address: event.target.value })}
                      required
                      error={errors.address}
                    />
                    <Field
                      label={dict.checkout.reference}
                      name="reference"
                      value={contact.reference}
                      onChange={(event) => setContact({ ...contact, reference: event.target.value })}
                    />
                    <Select label={dict.checkout.slot} name="slot" value={slot} onChange={(event) => setSlot(event.target.value)}>
                      {SLOTS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>
                ) : (
                  <p className="mono checkout__pickup">{dict.product.reserveHint}</p>
                )}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="form">
                <span className="eyebrow">{dict.checkout.paymentMethod}</span>
                <div className="form__choices">
                  {(['card', 'qr', 'transfer', 'cash'] as const).map((method) => (
                    <Choice
                      key={method}
                      name="payment"
                      value={method}
                      label={dict.checkout.payment[method]}
                      checked={payment === method}
                      onChange={(value) => setPayment(value as PaymentMethod)}
                    />
                  ))}
                </div>

                {payment === 'card' ? (
                  <div className="form__grid">
                    <Field
                      label={dict.checkout.cardNumber}
                      name="number"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={card.number}
                      onChange={(event) =>
                        setCard({
                          ...card,
                          number: event.target.value
                            .replace(/[^0-9]/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim(),
                        })
                      }
                      required
                      error={errors.number}
                    />
                    <Field
                      label={dict.checkout.cardName}
                      name="cardName"
                      value={card.name}
                      onChange={(event) => setCard({ ...card, name: event.target.value })}
                      required
                      error={errors.cardName}
                    />
                    <Field
                      label={dict.checkout.expiry}
                      name="expiry"
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(event) =>
                        setCard({
                          ...card,
                          expiry: event.target.value
                            .replace(/[^0-9]/g, '')
                            .slice(0, 4)
                            .replace(/(.{2})(.+)/, '$1/$2'),
                        })
                      }
                      required
                      error={errors.expiry}
                    />
                    <Field
                      label={dict.checkout.cvc}
                      name="cvc"
                      inputMode="numeric"
                      value={card.cvc}
                      onChange={(event) => setCard({ ...card, cvc: event.target.value.replace(/[^0-9]/g, '').slice(0, 4) })}
                      required
                      error={errors.cvc}
                    />
                  </div>
                ) : null}

                {payment === 'qr' ? <PaymentQr code={`SM-${Math.round(total)}-BO`} hue={200} /> : null}

                {payment === 'transfer' ? (
                  <dl className="bank">
                    <div>
                      <dt className="mono">Banco</dt>
                      <dd>Banco Nacional de Bolivia</dd>
                    </div>
                    <div>
                      <dt className="mono">Cuenta</dt>
                      <dd className="num">1000-4587-2201</dd>
                    </div>
                    <div>
                      <dt className="mono">NIT</dt>
                      <dd className="num">402118023</dd>
                    </div>
                  </dl>
                ) : null}

                {payment === 'cash' ? <p className="mono checkout__pickup">{dict.checkout.payment.cash}</p> : null}

                <p className="checkout__demo mono">{dict.checkout.demoNote}</p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="checkout__nav">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep((value) => value - 1)}>
              {dict.common.prev}
            </Button>
          ) : (
            <Link href={href('/catalogo', locale)} className="checkout__back mono">
              {dict.cart.goCatalog}
            </Link>
          )}

          {step < 2 ? (
            <Button
              size="lg"
              onClick={() => {
                if (validate(step)) setStep((value) => value + 1);
              }}
            >
              {dict.common.continue}
            </Button>
          ) : (
            <Button size="lg" magnetic onClick={pay} disabled={status === 'processing'}>
              {status === 'processing' ? dict.checkout.processing : `${dict.checkout.pay} ${money(total, locale)}`}
            </Button>
          )}
        </div>
      </div>

      <aside className="checkout__summary">
        <span className="eyebrow">{dict.checkout.summary}</span>
        <ul className="summary__lines">
          {cart.lines.map((line) => {
            const product = getProduct(line.slug);
            if (!product) return null;
            return (
              <li key={line.slug}>
                <span className="summary__art" aria-hidden="true">
                  <ProductArt
                    variant={product.art}
                    hue={product.hue}
                    chroma={product.chroma}
                    seed={product.slug}
                    detail={false}
                  />
                </span>
                <span className="summary__name">
                  {pick(product.name, locale)}
                  <span className="mono">×{line.qty}</span>
                </span>
                <span className="num">{money(product.price * line.qty, locale)}</span>
              </li>
            );
          })}
        </ul>

        <dl className="totals">
          <div>
            <dt>{dict.common.subtotal}</dt>
            <dd className="num">{money(cart.subtotal, locale)}</dd>
          </div>
          {cart.discount > 0 ? (
            <div>
              <dt>
                {dict.common.discount} · {cart.code}
              </dt>
              <dd className="num">-{money(cart.discount, locale)}</dd>
            </div>
          ) : null}
          <div>
            <dt>{dict.common.shipping}</dt>
            <dd className="num">{deliveryFee === 0 ? dict.common.free : money(deliveryFee, locale)}</dd>
          </div>
          <div className="totals__grand">
            <dt>{dict.common.total}</dt>
            <dd className="num">{money(total, locale)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
