'use client';

import { useEffect, useState } from 'react';
import { Clock, Zap, Shield, Eye, Globe, AlertCircle } from 'lucide-react';
import { getJson } from '@/lib/client-api';
import { Benefit } from '@/types';

// Icon map for dynamic rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  Clock,
  Zap,
  Shield,
  Eye,
  Globe,
};

// Mock benefits for testing
const mockBenefits: Benefit[] = [
  {
    id: '1',
    icon: 'Clock',
    title: 'Timing control',
    description: 'Convert when deals are ready, not when banks force it.',
  },
  {
    id: '2',
    icon: 'Zap',
    title: 'Faster execution',
    description: 'Move funds efficiently when timelines shift.',
  },
  {
    id: '3',
    icon: 'Shield',
    title: 'Margin protection',
    description: 'Reduce FX leakage from volatility and rushed conversions.',
  },
  {
    id: '4',
    icon: 'Eye',
    title: 'Operational clarity',
    description: 'One treasury view, not fragmented accounts.',
  },
  {
    id: '5',
    icon: 'Globe',
    title: 'Cross-border readiness',
    description: 'Deploy capital wherever opportunity appears next.',
  },
];

export function BenefitsSection() {
  const [benefits, setBenefits] = useState<Benefit[]>(mockBenefits);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getJson<Benefit[]>('/api/landing/benefits');
        setBenefits(data);
      } catch (err) {
        console.error('Failed to fetch benefits:', err);
        setError('Failed to load benefits');
        // Keep mock data on error
        setBenefits(mockBenefits);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-16 leading-tight">
          Built for property companies operating globally
        </h2>

        {error && (
          <div className="mb-8 p-4 rounded-lg border border-yellow-600/20 bg-yellow-950/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon] || Globe;
            return (
              <div
                key={benefit.id}
                className="relative p-8 rounded-2xl border border-primary/20 transition-all duration-500 hover:border-primary/40 hover:scale-[1.02]"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 0 20px rgba(12, 37, 115, 0.2), inset 0 0 20px rgba(12, 37, 115, 0.05)',
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

