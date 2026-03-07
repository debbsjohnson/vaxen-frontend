import { NextRequest, NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/backend-fetcher';
import { DashboardSummarySchema } from '@/types';

const BACKEND_DASHBOARD_PATH = process.env.BACKEND_DASHBOARD_PATH || '/api/dashboard/summary';

// Mock dashboard data for fallback
const mockDashboardSummary = {
  balances: [
    {
      currency: 'USD',
      amount: '300,000.00',
      change: '+2.5%',
      changeType: 'positive' as const,
    },
    {
      currency: 'EUR',
      amount: '191,250.00',
      change: '-1.2%',
      changeType: 'negative' as const,
    },
    {
      currency: 'GBP',
      amount: '118,500.00',
      change: '+0.8%',
      changeType: 'positive' as const,
    },
    {
      currency: 'BRL',
      amount: '375,000.00',
      change: '+1.5%',
      changeType: 'positive' as const,
    },
  ],
  transactions: [
    {
      id: '1',
      description: 'USD to EUR conversion',
      amount: '5,000.00 USD',
      date: 'Jan 15, 2024',
      status: 'completed' as const,
    },
    {
      id: '2',
      description: 'Payment to supplier',
      amount: '2,500.00 EUR',
      date: 'Jan 15, 2024',
      status: 'processing' as const,
    },
  ],
  stats: {
    totalVolume: 30_000_000,
    totalBusinesses: 1000,
    totalTransactions: 5000,
  },
};

export async function GET(request: NextRequest) {
  try {
    try {
      // Try to fetch from backend
      const response = await fetchBackend(BACKEND_DASHBOARD_PATH, {
        method: 'GET',
      });

      // Validate response structure
      const validated = DashboardSummarySchema.parse(response);
      return NextResponse.json(validated);
    } catch (backendError) {
      console.warn('Failed to fetch dashboard summary from backend, using mock data:', backendError);
      
      // Fallback to mock data
      const validated = DashboardSummarySchema.parse(mockDashboardSummary);
      return NextResponse.json(validated);
    }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    );
  }
}
