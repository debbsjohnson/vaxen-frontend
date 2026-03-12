'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { getJson } from '@/lib/client-api';
import { FAQ } from '@/types';

// Mock FAQs for testing
const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: "Who is Vaxen Global for?",
    answer: "Property companies deploying capital across borders, typically operating in multiple jurisdictions.",
  },
  {
    id: '2',
    question: "Do you support multiple currencies?",
    answer: "Yes. The platform is designed for multi-currency treasury management (exact currency list can be added later).",
  },
  {
    id: '3',
    question: "Can my team access the account?",
    answer: "Yes. Role-based access and approvals support teams with internal controls.",
  },
  {
    id: '4',
    question: "Is this a consumer money transfer app?",
    answer: "No. Vaxen is built for businesses managing high-value cross-border capital deployment.",
  },
  {
    id: '5',
    question: "How do I get access?",
    answer: "Submit the Request Access form. We review fit and follow up.",
  },
  {
    id: '6',
    question: "What regions do you support?",
    answer: "We currently support operations across Europe, South America, and Africa.",
  },
  {
    id: '7',
    question: "How long does onboarding take?",
    answer: "Onboarding typically takes 2-4 weeks depending on compliance requirements and account setup.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getJson<FAQ[]>('/api/landing/faqs');
        setFaqs(data);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setError('Failed to load FAQs');
        // Keep mock data on error
        setFaqs(mockFAQs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-16 leading-tight">
          Frequently Asked Questions
        </h2>

        {error && (
          <div className="mb-8 p-4 rounded-lg border border-yellow-600/20 bg-yellow-950/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border-b border-border pb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left hover:opacity-80 transition-opacity"
              >
                <span className="font-bold text-xl text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-6 w-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="pb-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

