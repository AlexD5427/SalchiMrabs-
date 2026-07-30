'use client';

import Link from 'next/link';
import { useState } from 'react';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { shops } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { Marquee } from '@/components/motion/Marquee';
import { SplitText } from '@/components/motion/SplitText';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="footer" data-tone="ink">
      <Marquee speed={40} className="footer__marquee">
        <span>Humo lento</span>
        <span aria-hidden="true">·</span>
        <span>Lote corto</span>
        <span aria-hidden="true">·</span>
        <span>Roble viejo</span>
        <span aria-hidden="true">·</span>
        <span>Sal de Uyuni</span>
        <span aria-hidden="true">·</span>
        <span>Slow smoke</span>
        <span aria-hidden="true">·</span>
        <span>Short batch</span>
        <span aria-hidden="true">·</span>
      </Marquee>

      <div className="wrap footer__inner">
        <div className="footer__top">
          <div className="footer__letter">
            <span className="eyebrow">{dict.footer.newsletter}</span>
            <SplitText as="h2" className="footer__title" text={dict.footer.newsletterBody} />
            <form
              className="footer__form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.includes('@')) return;
                setDone(true);
                setEmail('');
              }}
            >
              <input
                type="email"
                className="footer__input"
                placeholder={dict.footer.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-label={dict.footer.newsletter}
                required
              />
              <button type="submit" className="footer__submit">
                {done ? dict.footer.subscribed : dict.footer.subscribe}
              </button>
            </form>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <span className="footer__colTitle mono">{dict.footer.shop}</span>
              <Link href={href('/catalogo', locale)}>{dict.nav.catalog}</Link>
              <Link href={href('/club', locale)}>{dict.nav.club}</Link>
              <Link href={href('/reservas', locale)}>{dict.nav.reserve}</Link>
              <Link href={href('/checkout', locale)}>{dict.checkout.title}</Link>
            </div>
            <div className="footer__col">
              <span className="footer__colTitle mono">{dict.footer.house}</span>
              <Link href={href('/taller', locale)}>{dict.nav.workshop}</Link>
              <Link href={href('/recetas', locale)}>{dict.nav.recipes}</Link>
              <Link href={href('/clientes', locale)}>{dict.nav.clients}</Link>
              <Link href={href('/faq', locale)}>{dict.nav.faq}</Link>
            </div>
            <div className="footer__col">
              <span className="footer__colTitle mono">{dict.footer.explore}</span>
              <Link href={href('/cuenta', locale)}>{dict.nav.account}</Link>
              <a href="mailto:hola@salchimrabs.bo">hola@salchimrabs.bo</a>
              <a href="tel:+59122123456">+591 2 212 3456</a>
            </div>
          </div>
        </div>

        <div className="footer__shops">
          {shops.map((shop) => (
            <div key={shop.name} className="footer__shop">
              <strong>{shop.name}</strong>
              <span>{pick(shop.address, locale)}</span>
              <span className="mono">{shop.city}</span>
            </div>
          ))}
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          SalchiMrabs
        </div>

        <div className="footer__legal">
          <span className="mono">
            © {year} SalchiMrabs · {dict.footer.rights}
          </span>
          <span className="mono">{dict.footer.made}</span>
          <span className="mono">{dict.footer.hours}</span>
        </div>
      </div>
    </footer>
  );
}
