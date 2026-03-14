import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Honeypot check
		if (body.honeypot) {
			return NextResponse.json({ success: true }); // Silent fail for bots
		}

		// Validation
		if (!body.email || !body.password) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 },
			);
		}
	} catch (error) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}
}

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // Max 5 requests per IP

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const record = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

	// Reset count if it's been more than an hour
	if (now - record.lastRequest > 60 * 60 * 1000) {
		rateLimitMap.set(ip, { count: 1, lastRequest: now });
		return true;
	}

	if (record.count >= RATE_LIMIT) {
		return false;
	}

	record.count++;
	record.lastRequest = now;
	rateLimitMap.set(ip, record);
	return true;
}
