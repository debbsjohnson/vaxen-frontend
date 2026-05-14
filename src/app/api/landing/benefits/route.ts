import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';
import { BenefitListSchema } from '@/types';

const BACKEND_BENEFITS_PATH = process.env.BACKEND_BENEFITS_PATH || '/api/landing/benefits';
const USE_BACKEND_LANDING_CONTENT = process.env.USE_BACKEND_LANDING_CONTENT === 'true';

// Mock benefits for fallback
const mockBenefits = [
  {
    id: '1',
    icon: 'Clock',
    title: 'Timing control',
    description: 'Convert when deals are ready, not when banks force it.',
    order: 1,
  },
  {
    id: '2',
    icon: 'Zap',
    title: 'Faster execution',
    description: 'Move funds efficiently when timelines shift.',
    order: 2,
  },
  {
    id: '3',
    icon: 'Shield',
    title: 'Margin protection',
    description: 'Reduce FX leakage from volatility and rushed conversions.',
    order: 3,
  },
  {
    id: '4',
    icon: 'Eye',
    title: 'Operational clarity',
    description: 'One treasury view, not fragmented accounts.',
    order: 4,
  },
  {
    id: '5',
    icon: 'Globe',
    title: 'Cross-border readiness',
    description: 'Deploy capital wherever opportunity appears next.',
    order: 5,
  },
];

export async function GET(request: NextRequest) {
  try {
    if (!USE_BACKEND_LANDING_CONTENT) {
      const validated = BenefitListSchema.parse(mockBenefits);
      return NextResponse.json(validated);
    }

    try {
      // Try to fetch from backend
      const response = await fetchBackend(BACKEND_BENEFITS_PATH, {
        method: 'GET',
      });

      const data = await response.json();

      // Validate response structure
      const validated = BenefitListSchema.parse(data);
      return NextResponse.json(validated);
    } catch (backendError) {
      console.warn('Failed to fetch benefits from backend, using mock data:', backendError);
      
      // Fallback to mock data
      const validated = BenefitListSchema.parse(mockBenefits);
      return NextResponse.json(validated);
    }
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benefits' },
      { status: 500 }
    );
  }
}
