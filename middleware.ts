import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = new Set([
  'dashboard',
  'wallets',
  'convert',
  'payouts',
  'team',
  'reports',
  'settings',
  'admin',
  'notifications',
  'help',
]);

function getLocaleFromPath(pathname: string) {
  const [, locale] = pathname.split('/');
  if (routing.locales.includes(locale)) {
    return locale;
  }

  return routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPath(pathname);
  const routeSegment = pathname.split('/')[2] || '';
  const isLoggedIn = request.cookies.get('vaxen_auth')?.value === '1';

  if (protectedRoutes.has(routeSegment) && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/landing`, request.url));
  }

  if (routeSegment === 'login' && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlResponse;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\..*).*)'],
};
