import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const loggedIn = request.cookies.get('vaxen_auth')?.value === '1';

  return NextResponse.json({
    success: true,
    loggedIn,
  });
}
