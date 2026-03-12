'use client';

import { useEffect, useState } from 'react';
import { Wallet, Globe, ArrowLeftRight, Rocket, AlertCircle } from 'lucide-react';
import { getJson } from '@/lib/client-api';
import { HowItWorksStep } from '@/types';

// Icon map for dynamic rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  Wallet,
  Globe,
  ArrowLeftRight,
  Rocket,
};

// Mock steps for testing
const mockSteps: HowItWorksStep[] = [
  {
    id: '1',
    number: '1',
    icon: 'Wallet',
    title: 'Centralise capital',
    description: 'Centralise capital into a multi-currency treasury',
  },
  {
    id: '2',
    number: '2',
    icon: 'Globe',
    title: 'Manage balances',
    description: 'Manage balances across jurisdictions from one dashboard',
  },
  {
    id: '3',
    number: '3',
    icon: 'ArrowLeftRight',
    title: 'Convert strategically',
    description: 'Convert currencies strategically based on deal timelines',
  },
  {
    id: '4',
    number: '4',
    icon: 'Rocket',
    title: 'Deploy funds',
    description: 'Deploy funds for acquisitions and operating expenses',
  },
];

export function HowItWorksSection() {
  const [steps, setSteps] = useState<HowItWorksStep[]>(mockSteps);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getJson<HowItWorksStep[]>('/api/landing/how-it-works');
        setSteps(data);
      } catch (err) {
        console.error('Failed to fetch how-it-works:', err);
        setError('Failed to load how-it-works');
        // Keep mock data on error
        setSteps(mockSteps);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteps();
  }, []);

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-16 leading-tight">
          How it works
        </h2>

        {error && (
          <div className="mb-8 p-4 rounded-lg border border-yellow-600/20 bg-yellow-950/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = iconMap[step.icon] || Rocket;
            return (
              <div
                key={step.id}
                className="relative p-8 rounded-2xl border border-primary/20 transition-all duration-500 hover:border-primary/40 hover:scale-[1.02]"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 0 20px rgba(12, 37, 115, 0.2), inset 0 0 20px rgba(12, 37, 115, 0.05)',
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                    {step.number}
                  </div>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

