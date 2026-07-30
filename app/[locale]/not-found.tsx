import Link from 'next/link';
import { SceneArt } from '@/components/art/SceneArt';

export default function NotFound() {
  return (
    <section className="nf" data-tone="ink">
      <div className="nf__art" aria-hidden="true">
        <SceneArt hue={24} variant="smoke" />
      </div>
      <div className="wrap nf__inner">
        <span className="eyebrow">404</span>
        <h1 className="display">Se apagó el horno</h1>
        <p className="lede">
          Esta página no existe o ya se vendió el lote. <span className="italic-serif">The oven went out.</span>
        </p>
        <div className="nf__actions">
          <Link href="/es" className="btn btn--solid btn--md">
            <span className="btn__label">Volver al inicio</span>
          </Link>
          <Link href="/en" className="btn btn--outline btn--md">
            <span className="btn__label">Back home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
