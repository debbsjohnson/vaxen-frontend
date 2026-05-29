/**
 * POST /api/auth/login
 *
 * Trades email+password for a Supabase session, sets httpOnly cookies,
 * and returns the AuthSession shape the LoginForm + auth-state helpers
 * expect.
 *
 * Pipeline:
 *   1. Validate input + rate-limit by IP.
 *   2. Sign in with Supabase (server-side fetch, never exposes the
 *      `apikey` to the browser).
 *   3. Fetch the user's profile from core's /me using the brand-new
 *      access token, so we return the same `AuthUser` shape (with
 *      internal users.id, firstName/lastName, etc.) that older login
 *      callers received.
 *   4. Set httpOnly cookies for access + refresh tokens. The catch-all
 *      /api/v1 proxy reads vaxen_access_token on every subsequent call.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';
import { signInWithPassword, isSupabaseError } from '@/lib/supabase-auth';
import { setSessionCookies } from '@/lib/auth-cookies';

// Simple in-memory rate limiter (best-effort; per-process).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  record.count += 1;
  return true;
}

type LoginBody = {
  email?: unknown;
  password?: unknown;
  mfaCode?: unknown;
  honeypot?: unknown;
};

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as LoginBody;

    // Honeypot — silently 200 like the public endpoints do.
    if (typeof body.honeypot === 'string' && body.honeypot.trim() !== '') {
      return NextResponse.json({ success: true });
    }
    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
      return badRequest('Missing required fields');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return badRequest('Invalid email format');
    }

    // --- 1. Supabase password grant ---
    let session;
    try {
      session = await signInWithPassword(body.email, body.password);
    } catch (err) {
      if (isSupabaseError(err)) {
        return NextResponse.json({ error: err.message }, { status: err.status === 0 ? 502 : 401 });
      }
      console.error('login: supabase sign-in failed', err);
      return NextResponse.json({ error: 'Authentication service unavailable' }, { status: 502 });
    }

    // --- 2. Resolve the internal user via core's /me ---
    let user: Record<string, unknown> = {
      id: String(session.user?.id ?? ''),
      email: String(session.user?.email ?? body.email),
      firstName: '',
      lastName: '',
      organizationId: '',
      role: '',
      isDirector: false,
      mfaEnabled: false,
    };
    try {
      const meRes = await fetchBackend('/api/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });
      if (meRes.ok) {
        const payload = (await meRes.json()) as { data?: Record<string, unknown> };
        if (payload?.data && typeof payload.data === 'object') {
          user = { ...user, ...payload.data };
        }
      }
    } catch (err) {
      // Non-fatal: core may not be reachable yet. The cookies are still
      // valid, and the next API call will populate the user shape.
      console.warn('login: /me lookup failed, continuing with Supabase user data', err);
    }

    const response = NextResponse.json({
      success: true,
      data: {
        // CSRF cookie pattern isn't required when tokens are httpOnly +
        // SameSite=Lax, but the existing client reads csrfToken from the
        // response, so emit a stable string. Empty is fine.
        csrfToken: '',
        user,
      },
    });

    // --- 3. Set httpOnly session cookies ---
    setSessionCookies(response, {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in || 3600,
    });

    return response;
  } catch (err) {
    console.error('login: unexpected error', err);
    return NextResponse.json({ error: 'Unable to sign in right now' }, { status: 500 });
  }
}
