import { z } from 'zod';
export declare const WalletSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    type: z.ZodEnum<["fiat", "crypto"]>;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    balance: z.ZodString;
    availableBalance: z.ZodString;
    pendingBalance: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "fiat" | "crypto";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    balance: string;
    availableBalance: string;
    pendingBalance: string;
}, {
    id: string;
    organizationId: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "fiat" | "crypto";
    createdAt: Date;
    updatedAt: Date;
    balance: string;
    availableBalance: string;
    pendingBalance: string;
    isActive?: boolean | undefined;
}>;
export type Wallet = z.infer<typeof WalletSchema>;
export declare const CreateWalletRequestSchema: z.ZodObject<{
    type: z.ZodEnum<["fiat", "crypto"]>;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
}, "strip", z.ZodTypeAny, {
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "fiat" | "crypto";
}, {
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "fiat" | "crypto";
}>;
export type CreateWalletRequest = z.infer<typeof CreateWalletRequestSchema>;
export declare const WalletTransactionSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    walletId: z.ZodString;
    type: z.ZodEnum<["deposit", "withdrawal", "transfer_in", "transfer_out", "conversion", "fee"]>;
    amount: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    description: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed"]>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "fee" | "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "conversion";
    status: "pending" | "failed" | "processing" | "completed";
    createdAt: Date;
    updatedAt: Date;
    amount: string;
    walletId: string;
    description: string;
    reference?: string | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "fee" | "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "conversion";
    status: "pending" | "failed" | "processing" | "completed";
    createdAt: Date;
    updatedAt: Date;
    amount: string;
    walletId: string;
    description: string;
    reference?: string | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>;
//# sourceMappingURL=wallet.d.ts.map