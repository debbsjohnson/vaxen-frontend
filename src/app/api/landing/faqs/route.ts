import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';
import { FAQListSchema } from '@/types';

const BACKEND_FAQS_PATH = process.env.BACKEND_FAQS_PATH || '/api/landing/faqs';
const USE_BACKEND_LANDING_CONTENT = process.env.USE_BACKEND_LANDING_CONTENT === 'true';

// Mock FAQs for fallback
const mockFAQs = [
  {
    id: '1',
    question: "Who is Vaxen Global for?",
    answer: "Property companies deploying capital across borders, typically operating in multiple jurisdictions.",
    order: 1,
  },
  {
    id: '2',
    question: "Do you support multiple currencies?",
    answer: "Yes. The platform is designed for multi-currency treasury management (exact currency list can be added later).",
    order: 2,
  },
  {
    id: '3',
    question: "Can my team access the account?",
    answer: "Yes. Role-based access and approvals support teams with internal controls.",
    order: 3,
  },
  {
    id: '4',
    question: "Is this a consumer money transfer app?",
    answer: "No. Vaxen is built for businesses managing high-value cross-border capital deployment.",
    order: 4,
  },
  {
    id: '5',
    question: "How do I get access?",
    answer: "Submit the Request Access form. We review fit and follow up.",
    order: 5,
  },
  {
    id: '6',
    question: "What regions do you support?",
    answer: "We currently support operations across Europe, South America, and Africa.",
    order: 6,
  },
  {
    id: '7',
    question: "How long does onboarding take?",
    answer: "Onboarding typically takes 2-4 weeks depending on compliance requirements and account setup.",
    order: 7,
  },
];

export async function GET(request: NextRequest) {
  try {
    if (!USE_BACKEND_LANDING_CONTENT) {
      const validated = FAQListSchema.parse(mockFAQs);
      return NextResponse.json(validated);
    }

    try {
      // Try to fetch from backend
      const response = await fetchBackend(BACKEND_FAQS_PATH, {
        method: 'GET',
      });

      const data = await response.json();

      // Validate response structure
      const validated = FAQListSchema.parse(data);
      return NextResponse.json(validated);
    } catch (backendError) {
      console.warn('Failed to fetch FAQs from backend, using mock data:', backendError);
      
      // Fallback to mock data
      const validated = FAQListSchema.parse(mockFAQs);
      return NextResponse.json(validated);
    }
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}
