'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';

type Variant = 'solid' | 'ink' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Common {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  magnetic?: boolean;
  className?: string;
  cursor?: string;
}

function classes(variant: Variant, size: Size, full?: boolean, extra?: string) {
  return ['btn', `btn--${variant}`, `btn--${size}`, full ? 'btn--full' : '', extra ?? '']
    .filter(Boolean)
    .join(' ');
}

export function Button({
  children,
  variant = 'solid',
  size = 'md',
  full,
  magnetic,
  className,
  cursor,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const node = (
    <button className={classes(variant, size, full, className)} data-cursor={cursor} {...rest}>
      <span className="btn__label">{children}</span>
      <span className="btn__wash" aria-hidden="true" />
    </button>
  );
  return magnetic ? <Magnetic strength={0.18}>{node}</Magnetic> : node;
}

export function LinkButton({
  children,
  href,
  variant = 'solid',
  size = 'md',
  full,
  magnetic,
  className,
  cursor,
  ...rest
}: Common & { href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>) {
  const node = (
    <Link href={href} className={classes(variant, size, full, className)} data-cursor={cursor} {...rest}>
      <span className="btn__label">{children}</span>
      <span className="btn__wash" aria-hidden="true" />
    </Link>
  );
  return magnetic ? <Magnetic strength={0.18}>{node}</Magnetic> : node;
}
