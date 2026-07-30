import Link from 'next/link';
import { SceneArt } from '@/components/art/SceneArt';

export default function GlobalNotFound() {
  return (
    <section className="nf" data-tone="ink">
      <div className="nf__art" aria-hidden="true">
        <SceneArt hue={24} variant="smoke" />
      </div>
      <div className="wrap nf__inner">
        <span className="eyebrow">404</span>
        <h1 className="display">Se apagó el horno</h1>
        <p className="lede">
          Esta página no existe o ya se vendió el lote.{' '}
          <span className="italic-serif">The oven went out.</span>
        </p>
        <div className="nf__actions">
          <Link href="/es" className="btn btn--solid btn--md">
            <span className="btn__label">Volver al inicio</span>
            <span className="btn__wash" aria-hidden="true" />
          </Link>
          <Link href="/en" className="btn btn--outline btn--md">
            <span className="btn__label">Back home</span>
            <span className="btn__wash" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
