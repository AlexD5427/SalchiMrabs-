import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['es', 'en'] as const;
const DEFAULT_LOCALE = 'es';

function pickLocale(request: NextRequest): string {
  const cookie = request.cookies.get('salchimrabs.locale')?.value;
  if (cookie && LOCALES.includes(cookie as (typeof LOCALES)[number])) return cookie;

  const header = (request.headers.get('accept-language') || '').toLowerCase();
  for (const chunk of header.split(',')) {
    const tag = chunk.split(';')[0].trim();
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('en')) return 'en';
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
