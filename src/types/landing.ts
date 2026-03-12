import { z } from 'zod';

// FAQ
export const FAQSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  order: z.number().optional(),
});

export type FAQ = z.infer<typeof FAQSchema>;

export const FAQListSchema = z.array(FAQSchema);
export type FAQList = z.infer<typeof FAQListSchema>;

// Benefits
export const BenefitSchema = z.object({
  id: z.string(),
  icon: z.string(), // Icon name as string
  title: z.string(),
  description: z.string(),
  order: z.number().optional(),
});

export type Benefit = z.infer<typeof BenefitSchema>;

export const BenefitListSchema = z.array(BenefitSchema);
export type BenefitList = z.infer<typeof BenefitListSchema>;

// How It Works
export const HowItWorksStepSchema = z.object({
  id: z.string(),
  number: z.string(),
  icon: z.string(), // Icon name as string
  title: z.string(),
  description: z.string(),
  order: z.number().optional(),
});

export type HowItWorksStep = z.infer<typeof HowItWorksStepSchema>;

export const HowItWorksListSchema = z.array(HowItWorksStepSchema);
export type HowItWorksList = z.infer<typeof HowItWorksListSchema>;

// Dashboard Balance
export const DashboardBalanceSchema = z.object({
  currency: z.string(),
  amount: z.string(),
  change: z.string(),
  changeType: z.enum(['positive', 'negative', 'neutral']),
});

export type DashboardBalance = z.infer<typeof DashboardBalanceSchema>;

// Dashboard Transaction
export const DashboardTransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.string(),
  date: z.string(),
  status: z.enum(['completed', 'processing', 'pending', 'failed']),
});

export type DashboardTransaction = z.infer<typeof DashboardTransactionSchema>;

// Dashboard Summary
export const DashboardSummarySchema = z.object({
  balances: z.array(DashboardBalanceSchema),
  transactions: z.array(DashboardTransactionSchema),
  stats: z.object({
    totalVolume: z.number(),
    totalBusinesses: z.number(),
    totalTransactions: z.number(),
  }).optional(),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

// Request Access Form
export const RequestAccessFormSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email(),
  country: z.string(),
  markets: z.array(z.string()).min(1),
  annualVolume: z.string(),
  useCase: z.string(),
  website: z.string().optional(),
  notes: z.string().optional(),
  honeypot: z.string().optional(), // Spam prevention
});

export type RequestAccessForm = z.infer<typeof RequestAccessFormSchema>;

export const RequestAccessResponseSchema = z.object({
  success: z.boolean(),
  id: z.string().optional(),
  message: z.string().optional(),
});

export type RequestAccessResponse = z.infer<typeof RequestAccessResponseSchema>;
