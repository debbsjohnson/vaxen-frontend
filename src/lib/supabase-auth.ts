/**
 * Server-side Supabase auth helper.
 *
 * Only used from Next.js Route Handlers (running on the server) — never
 * imported by client components. Keeps the publishable key + URL in one
 * place and centralises Supabase's quirky error shape.
 *
 * Flow:
 *   signInWithPassword → returns access_token (JWT, ES256-signed by
 *   Supabase) + refresh_token. The route handler sets these as httpOnly
 *   cookies; the catch-all `/api/v1/*` proxy then attaches the access
 *   token as `Authorization: Bearer` on every forwarded call to core.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  token_type: 'bearer';
  user: {
    id: string;
    email?: string;
    [k: string]: unknown;
  };
};

export type SupabaseError = {
  status: number;
  message: string;
};

function headers(): Record<string, string> {
  if (!SUPABASE_PUBLISHABLE_KEY) {
    // Fail loudly — the route handlers must have this configured.
    throw new Error('SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) is not set');
  }
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_PUBLISHABLE_KEY,
  };
}

async function parseError(res: Response): Promise<SupabaseError> {
  let msg = 'Authentication failed';
  try {
    const body = (await res.json()) as { error_description?: string; msg?: string; error?: string };
    msg = body.error_description || body.msg || body.error || msg;
  } catch {
    /* keep default */
  }
  return { status: res.status, message: msg };
}

export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw await parseError(res);
  }
  return (await res.json()) as SupabaseSession;
}

export async function refreshAccessToken(refreshToken: string): Promise<SupabaseSession> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw await parseError(res);
  }
  return (await res.json()) as SupabaseSession;
}

/**
 * Best-effort logout on Supabase. The browser cookies are cleared by
 * the route handler regardless; if Supabase is unreachable we still
 * succeed locally so the user isn't stuck "logged in" on the frontend.
 */
export async function signOut(accessToken: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { ...headers(), Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
  } catch {
    /* swallow — the cookies are cleared either way */
  }
}

export function isSupabaseError(err: unknown): err is SupabaseError {
  return typeof err === 'object' && err !== null && 'status' in err && 'message' in err;
}
