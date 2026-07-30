'use client';

import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';
import { SceneArt } from '@/components/art/SceneArt';
import { Parallax } from '@/components/motion/Parallax';

interface PageHeadProps {
  eyebrow: string;
  title: string;
  lede?: string;
  hue?: number;
  variant?: 'oven' | 'chamber' | 'table' | 'smoke';
}

/** Shared interior-page opener: ink band, drawn scene, masked title reveal. */
export function PageHead({ eyebrow, title, lede, hue = 38, variant = 'smoke' }: PageHeadProps) {
  return (
    <header className="phead" data-tone="ink" style={{ ['--accent' as string]: `oklch(62% 0.16 ${hue})` }}>
      <div className="phead__art" aria-hidden="true">
        <Parallax amount={60} scale>
          <SceneArt hue={hue} variant={variant} />
        </Parallax>
      </div>
      <div className="wrap phead__inner">
        <span className="eyebrow">{eyebrow}</span>
        <SplitText as="h1" className="display phead__title" text={title} immediate delay={0.1} />
        {lede ? (
          <Reveal delay={0.25}>
            <p className="lede phead__lede">{lede}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
