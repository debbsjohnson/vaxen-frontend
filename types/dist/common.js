import { z } from 'zod';
// Currency codes
export const CurrencyCodeSchema = z.enum([
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NOK',
    'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RUB', 'TRY', 'ZAR',
    'BRL', 'MXN', 'INR', 'KRW', 'SGD', 'HKD', 'NZD', 'THB', 'MYR', 'PHP',
    'IDR', 'VND', 'BTC', 'ETH', 'USDC', 'USDT'
]);
// Amount with currency
export const AmountSchema = z.object({
    value: z.string().regex(/^\d+(\.\d{1,8})?$/),
    currency: CurrencyCodeSchema,
});
// Pagination
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});
// API Response wrapper
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
});
// Paginated response
export const PaginatedResponseSchema = z.object({
    data: z.array(z.any()),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
});
// Status enums
export const StatusSchema = z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']);
export const WalletTypeSchema = z.enum(['fiat', 'crypto']);
export const OrderTypeSchema = z.enum(['market', 'limit']);
export const ConversionTypeSchema = z.enum(['spot', 'auto_convert', 'limit']);
// Timestamps
export const TimestampsSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
});
//# sourceMappingURL=common.js.map