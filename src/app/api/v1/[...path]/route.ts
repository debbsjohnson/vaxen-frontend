/**
 * Catch-all proxy: /api/v1/* → core (BACKEND_API_URL).
 *
 * Two things this layer adds beyond a dumb forwarder:
 *
 *   1. Attaches the Supabase access token from the httpOnly cookie as
 *      `Authorization: Bearer …` on every forwarded request. Clients
 *      never see the token, never write it, can't leak it via XSS.
 *
 *   2. Transparent token refresh on 401. When core says "expired",
 *      we trade the httpOnly refresh token for a new access token via
 *      Supabase, update cookies, and replay the original request once.
 *      The client gets back a successful response and never knows a
 *      refresh happened.
 *
 * Anything not authenticated (e.g. POST /auth/request-access) still
 * works because the Bearer header is only attached when a cookie is
 * present.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  clearSessionCookies,
  setSessionCookies,
} from '@/lib/auth-cookies';
import { refreshAccessToken, isSupabaseError } from '@/lib/supabase-auth';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

// Headers we forward verbatim from the browser. Authorization is
// deliberately excluded — we set it from the httpOnly cookie instead so
// the client can't bypass or override it.
const FORWARDED_HEADERS = ['content-type', 'x-csrf-token', 'x-request-id', 'x-organization-id'];
const REDIRECT_STATUSES = new Set([301, 302, 307, 308]);

function buildForwardHeaders(request: NextRequest, accessToken: string | undefined): Headers {
  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }
  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }
  if (accessToken) {
    headers.set('authorization', `Bearer ${accessToken}`);
  }
  return headers;
}

async function fetchBackendFollowingRedirect(path: string, init: RequestInit) {
  const firstResponse = await fetchBackend(path, init);
  if (!REDIRECT_STATUSES.has(firstResponse.status)) {
    return firstResponse;
  }
  const location = firstResponse.headers.get('location');
  if (!location) {
    return firstResponse;
  }
  const resolved = new URL(location, firstResponse.url);
  const redirectedPath = `${resolved.pathname}${resolved.search}`;
  return fetchBackend(redirectedPath, init);
}

/** Buffers the request body once so we can replay after a silent refresh. */
async function readBody(request: NextRequest): Promise<string | undefined> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return undefined;
  }
  return request.text();
}

async function proxyToBackend(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const pathStr = path.join('/');
  const search = request.nextUrl.search;
  const backendPath = `/api/v1/${pathStr}${search}`;

  let accessToken = request.cookies.get(COOKIE_ACCESS)?.value;
  const refreshToken = request.cookies.get(COOKIE_REFRESH)?.value;
  const requestBody = await readBody(request);

  const buildInit = (token: string | undefined): RequestInit => ({
    method: request.method,
    headers: buildForwardHeaders(request, token),
    cache: 'no-store',
    redirect: 'manual',
    body: requestBody,
  });

  let backendResponse = await fetchBackendFollowingRedirect(backendPath, buildInit(accessToken));

  // Transparent refresh on expired access token.
  let refreshedSession:
    | { accessToken: string; refreshToken: string; expiresIn: number }
    | undefined;

  if (backendResponse.status === 401 && refreshToken && accessToken) {
    try {
      const refreshed = await refreshAccessToken(refreshToken);
      refreshedSession = {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        expiresIn: refreshed.expires_in || 3600,
      };
      accessToken = refreshed.access_token;
      backendResponse = await fetchBackendFollowingRedirect(backendPath, buildInit(accessToken));
    } catch (err) {
      // Refresh failed → the session is dead. Clear cookies so the
      // middleware sends the user to the landing page on the next nav.
      if (!isSupabaseError(err)) {
        console.warn('proxy: refresh attempt errored', err);
      }
      const response = passthroughResponse(backendResponse, await backendResponse.text());
      clearSessionCookies(response);
      return response;
    }
  }

  const bodyText = await backendResponse.text();
  const response = passthroughResponse(backendResponse, bodyText);
  if (refreshedSession) {
    setSessionCookies(response, refreshedSession);
  }
  return response;
}

function passthroughResponse(backendResponse: Response, bodyText: string) {
  const responseHeaders = new Headers();
  const contentType = backendResponse.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }
  responseHeaders.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  responseHeaders.set('pragma', 'no-cache');
  responseHeaders.set('expires', '0');

  const setCookie = backendResponse.headers.get('set-cookie');
  if (setCookie) {
    responseHeaders.set('set-cookie', setCookie);
  }

  return new NextResponse(bodyText || null, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyToBackend(request, context);
}
export async function POST(request: NextRequest, context: RouteContext) {
  return proxyToBackend(request, context);
}
export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyToBackend(request, context);
}
export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyToBackend(request, context);
}
export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyToBackend(request, context);
}
