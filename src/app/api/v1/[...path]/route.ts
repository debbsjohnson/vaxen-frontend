import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

const FORWARDED_HEADERS = ['authorization', 'content-type', 'x-csrf-token', 'x-request-id'];
const REDIRECT_STATUSES = new Set([301, 302, 307, 308]);

function buildForwardHeaders(request: NextRequest) {
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

async function proxyToBackend(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const pathStr = path.join('/');
  const search = request.nextUrl.search;
  const backendPath = `/api/v1/${pathStr}${search}`;

  const headers = buildForwardHeaders(request);
  const method = request.method;

  const requestBody = method !== 'GET' && method !== 'HEAD' ? await request.text() : undefined;

  const init: RequestInit = {
    method,
    headers,
    cache: 'no-store',
    redirect: 'manual',
    body: requestBody,
  };

  const backendResponse = await fetchBackendFollowingRedirect(backendPath, init);
  const bodyText = await backendResponse.text();

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

  const response = new NextResponse(bodyText || null, {
    status: backendResponse.status,
    headers: responseHeaders,
  });

  let parsedBody: unknown;
  if (bodyText) {
    try {
      parsedBody = JSON.parse(bodyText);
    } catch {
      parsedBody = undefined;
    }
  }

  const isSuccessResponse =
    backendResponse.ok &&
    typeof parsedBody === 'object' &&
    parsedBody !== null &&
    'success' in parsedBody &&
    (parsedBody as { success?: unknown }).success === true;

  const isMfaChallenge =
    typeof parsedBody === 'object' &&
    parsedBody !== null &&
    'data' in parsedBody &&
    typeof (parsedBody as { data?: unknown }).data === 'object' &&
    (parsedBody as { data?: { requiresMfa?: unknown } }).data?.requiresMfa === true;

  if (pathStr === 'auth/login' && isSuccessResponse && !isMfaChallenge) {
    response.cookies.set('vaxen_auth', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }

  if (pathStr === 'auth/logout' && isSuccessResponse) {
    response.cookies.set('vaxen_auth', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
  }

  return response;
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
