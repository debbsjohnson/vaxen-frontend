import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';
import { HowItWorksListSchema } from '@/types';

const BACKEND_HOW_IT_WORKS_PATH = process.env.BACKEND_HOW_IT_WORKS_PATH || '/api/landing/how-it-works';
const USE_BACKEND_LANDING_CONTENT = process.env.USE_BACKEND_LANDING_CONTENT === 'true';

// Mock steps for fallback
const mockSteps = [
  {
    id: '1',
    number: '1',
    icon: 'Wallet',
    title: 'Centralise capital',
    description: 'Centralise capital into a multi-currency treasury',
    order: 1,
  },
  {
    id: '2',
    number: '2',
    icon: 'Globe',
    title: 'Manage balances',
    description: 'Manage balances across jurisdictions from one dashboard',
    order: 2,
  },
  {
    id: '3',
    number: '3',
    icon: 'ArrowLeftRight',
    title: 'Convert strategically',
    description: 'Convert currencies strategically based on deal timelines',
    order: 3,
  },
  {
    id: '4',
    number: '4',
    icon: 'Rocket',
    title: 'Deploy funds',
    description: 'Deploy funds for acquisitions and operating expenses',
    order: 4,
  },
];

export async function GET(request: NextRequest) {
  try {
    if (!USE_BACKEND_LANDING_CONTENT) {
      const validated = HowItWorksListSchema.parse(mockSteps);
      return NextResponse.json(validated);
    }

    try {
      // Try to fetch from backend
      const response = await fetchBackend(BACKEND_HOW_IT_WORKS_PATH, {
        method: 'GET',
      });

      const data = await response.json();

      // Validate response structure
      const validated = HowItWorksListSchema.parse(data);
      return NextResponse.json(validated);
    } catch (backendError) {
      console.warn('Failed to fetch how-it-works from backend, using mock data:', backendError);
      
      // Fallback to mock data
      const validated = HowItWorksListSchema.parse(mockSteps);
      return NextResponse.json(validated);
    }
  } catch (error) {
    console.error('Error fetching how-it-works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch how-it-works' },
      { status: 500 }
    );
  }
}
