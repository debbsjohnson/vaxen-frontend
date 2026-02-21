import { z } from 'zod';
import { CurrencyCodeSchema, WalletTypeSchema, TimestampsSchema } from './common';
export const WalletSchema = z.object({
    id: z.string(),
    organizationId: z.string(),
    type: WalletTypeSchema,
    currency: CurrencyCodeSchema,
    balance: z.string(),
    availableBalance: z.string(),
    pendingBalance: z.string(),
    isActive: z.boolean().default(true),
    ...TimestampsSchema.shape,
});
export const CreateWalletRequestSchema = z.object({
    type: WalletTypeSchema,
    currency: CurrencyCodeSchema,
});
export const WalletTransactionSchema = z.object({
    id: z.string(),
    walletId: z.string(),
    type: z.enum(['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'conversion', 'fee']),
    amount: z.string(),
    currency: CurrencyCodeSchema,
    description: z.string(),
    reference: z.string().optional(),
    status: z.enum(['pending', 'processing', 'completed', 'failed']),
    metadata: z.record(z.any()).optional(),
    ...TimestampsSchema.shape,
});
//# sourceMappingURL=wallet.js.map