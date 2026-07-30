'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { href, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { products } from '@/lib/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { SplitText } from '@/components/motion/SplitText';
import { LinkButton } from '@/components/ui/Button';

/**
 * Desktop: the section pins and the rail scrubs horizontally.
 * Mobile: same markup, native scroll-snap. One component, two experiences.
 */
export function CatalogRail({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionNode = section.current;
    const trackNode = track.current;
    if (!sectionNode || !trackNode) return;

    const media = gsap.matchMedia();

    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(trackNode.scrollWidth - window.innerWidth + 140, 0);

      const tween = gsap.to(trackNode, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionNode,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(trackNode, { x: 0 });
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className="rail" ref={section} id="catalogo" data-tone="ink">
      <div className="wrap rail__head">
        <div>
          <span className="eyebrow">{dict.home.catalogEyebrow}</span>
          <SplitText as="h2" className="title rail__title" text={dict.home.catalogTitle} />
        </div>
        <div className="rail__meta">
          <p className="mono">{dict.home.catalogBody}</p>
          <LinkButton href={href('/catalogo', locale)} variant="outline" size="sm">
            {dict.common.viewAll}
          </LinkButton>
        </div>
      </div>

      <div className="rail__viewport">
        <div className="rail__track" ref={track}>
          {products.map((product, index) => (
            <div className="rail__slot" key={product.slug}>
              <ProductCard product={product} locale={locale} dict={dict} index={index} layout="rail" />
            </div>
          ))}
          <div className="rail__end">
            <span className="mono">{dict.catalog.title}</span>
            <LinkButton href={href('/catalogo', locale)} variant="solid" size="lg" magnetic>
              {dict.common.viewAll}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
