import { z } from 'zod';
import { AmountSchema, TimestampsSchema } from './common';
export const LedgerEntrySchema = z.object({
    id: z.string(),
    organizationId: z.string(),
    journalId: z.string(),
    account: z.string(),
    debit: AmountSchema.optional(),
    credit: AmountSchema.optional(),
    description: z.string(),
    reference: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    ...TimestampsSchema.shape,
});
export const JournalSchema = z.object({
    id: z.string(),
    organizationId: z.string(),
    type: z.string(),
    description: z.string(),
    reference: z.string().optional(),
    status: z.enum(['pending', 'posted', 'reversed']),
    postedAt: z.date().optional(),
    ...TimestampsSchema.shape,
});
export const ReconciliationRunSchema = z.object({
    id: z.string(),
    organizationId: z.string(),
    date: z.date(),
    status: z.enum(['pending', 'completed', 'failed']),
    discrepancies: z.array(z.object({
        type: z.string(),
        amount: AmountSchema,
        description: z.string(),
    })),
    completedAt: z.date().optional(),
    ...TimestampsSchema.shape,
});
//# sourceMappingURL=ledger.js.map