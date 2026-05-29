import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';

// Rate limiting store (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const BACKEND_REQUEST_ACCESS_PATH = process.env.BACKEND_REQUEST_ACCESS_PATH || '/api/v1/auth/request-access';

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

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }); // Silent fail for bots
    }

    const legacyName = typeof body.name === 'string' ? body.name.trim() : '';
    const [legacyFirstName = '', ...legacyLastNameParts] = legacyName.split(/\s+/);
    const firstName = (typeof body.firstName === 'string' ? body.firstName.trim() : '') || legacyFirstName;
    const lastName =
      (typeof body.lastName === 'string' ? body.lastName.trim() : '') ||
      legacyLastNameParts.join(' ').trim();

    // Validation
    if (!firstName || !lastName || !body.company || !body.email || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields. Include full name, company, email, and role.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const payload = {
      firstName,
      lastName,
      company: body.company,
      email: body.email,
      role: body.role,
      country: body.country,
      markets: body.markets,
      annualVolume: body.annualVolume,
      useCase: body.useCase,
      website: body.website,
      notes: body.notes,
    };

    const backendResponse = await fetchBackend(BACKEND_REQUEST_ACCESS_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    let backendData: unknown = null;
    try {
      backendData = await backendResponse.json();
    } catch {
      backendData = null;
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        backendData || { error: 'Backend request failed' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(backendData || { success: true });
  } catch (error) {
    console.error('Error proxying request-access:', error);
    return NextResponse.json(
      { error: 'Unable to reach backend service' },
      { status: 502 }
    );
  }
}

