/**
 * Centralised cookie names + setters/clearers for the session.
 *
 *   vaxen_access_token  — Supabase ES256 JWT. HttpOnly. Forwarded as
 *                         `Authorization: Bearer` by the catch-all
 *                         /api/v1 proxy to core. Never readable from JS.
 *   vaxen_refresh_token — Supabase refresh token. HttpOnly. Used by the
 *                         proxy to silently refresh when core returns
 *                         401 with an expired access token.
 *   vaxen_auth          — Cosmetic "are we logged in" marker the
 *                         middleware reads for redirects. Not used for
 *                         authentication itself.
 */

import type { NextResponse } from 'next/server';

export const COOKIE_ACCESS = 'vaxen_access_token';
export const COOKIE_REFRESH = 'vaxen_refresh_token';
export const COOKIE_FLAG = 'vaxen_auth';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const PROD = process.env.NODE_ENV === 'production';

export type SessionCookieInput = {
  accessToken: string;
  refreshToken: string;
  /** Lifetime of the access token in seconds, as reported by Supabase. */
  expiresIn: number;
};

export function setSessionCookies(res: NextResponse, s: SessionCookieInput) {
  res.cookies.set(COOKIE_ACCESS, s.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: PROD,
    path: '/',
    maxAge: Math.max(60, s.expiresIn),
  });
  res.cookies.set(COOKIE_REFRESH, s.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: PROD,
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  });
  res.cookies.set(COOKIE_FLAG, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: PROD,
    path: '/',
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearSessionCookies(res: NextResponse) {
  for (const name of [COOKIE_ACCESS, COOKIE_REFRESH, COOKIE_FLAG]) {
    res.cookies.set(name, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: PROD,
      path: '/',
      maxAge: 0,
    });
  }
}
