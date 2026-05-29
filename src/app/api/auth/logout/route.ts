/**
 * POST /api/auth/logout
 *
 * Clears the session cookies and (best-effort) tells Supabase to
 * invalidate the access token. We always succeed locally so the user
 * isn't stuck "logged in" if Supabase happens to be unreachable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/supabase-auth';
import { COOKIE_ACCESS, clearSessionCookies } from '@/lib/auth-cookies';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_ACCESS)?.value;
  if (accessToken) {
    await signOut(accessToken);
  }
  const response = NextResponse.json({ success: true, data: { message: 'Signed out' } });
  clearSessionCookies(response);
  return response;
}
