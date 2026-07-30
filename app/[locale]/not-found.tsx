import Link from 'next/link';
import { SceneArt } from '@/components/art/SceneArt';

export default function LocaleNotFound() {
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
          <Link href="/es/catalogo" className="btn btn--solid btn--md">
            <span className="btn__label">Ver el catálogo</span>
            <span className="btn__wash" aria-hidden="true" />
          </Link>
          <Link href="/en/catalogo" className="btn btn--outline btn--md">
            <span className="btn__label">See the catalogue</span>
            <span className="btn__wash" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
