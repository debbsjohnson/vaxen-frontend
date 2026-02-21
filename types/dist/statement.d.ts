import { z } from 'zod';
export declare const StatementFileSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    type: z.ZodEnum<["pdf", "csv"]>;
    period: z.ZodObject<{
        startDate: z.ZodDate;
        endDate: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        startDate: Date;
        endDate: Date;
    }, {
        startDate: Date;
        endDate: Date;
    }>;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    fileUrl: z.ZodString;
    fileSize: z.ZodNumber;
    status: z.ZodEnum<["generating", "ready", "failed"]>;
    generatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "pdf" | "csv";
    status: "failed" | "generating" | "ready";
    createdAt: Date;
    updatedAt: Date;
    fileUrl: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    fileSize: number;
    generatedAt?: Date | undefined;
}, {
    id: string;
    organizationId: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "pdf" | "csv";
    status: "failed" | "generating" | "ready";
    createdAt: Date;
    updatedAt: Date;
    fileUrl: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    fileSize: number;
    generatedAt?: Date | undefined;
}>;
export type StatementFile = z.infer<typeof StatementFileSchema>;
export declare const GenerateStatementRequestSchema: z.ZodObject<{
    type: z.ZodEnum<["pdf", "csv"]>;
    period: z.ZodObject<{
        startDate: z.ZodDate;
        endDate: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        startDate: Date;
        endDate: Date;
    }, {
        startDate: Date;
        endDate: Date;
    }>;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
}, "strip", z.ZodTypeAny, {
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "pdf" | "csv";
    period: {
        startDate: Date;
        endDate: Date;
    };
}, {
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "pdf" | "csv";
    period: {
        startDate: Date;
        endDate: Date;
    };
}>;
export type GenerateStatementRequest = z.infer<typeof GenerateStatementRequestSchema>;
//# sourceMappingURL=statement.d.ts.map