import { z } from 'zod';
export declare const AccountNumberSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    name: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    type: z.ZodEnum<["iban", "pix", "ach", "swift"]>;
    accountNumber: z.ZodString;
    routingNumber: z.ZodOptional<z.ZodString>;
    bankCode: z.ZodOptional<z.ZodString>;
    bankName: z.ZodString;
    bankCountry: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "iban" | "pix" | "ach" | "swift";
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
}, {
    id: string;
    organizationId: string;
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "iban" | "pix" | "ach" | "swift";
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    createdAt: Date;
    updatedAt: Date;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type AccountNumber = z.infer<typeof AccountNumberSchema>;
export declare const CreateAccountNumberRequestSchema: z.ZodObject<{
    name: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    type: z.ZodEnum<["iban", "pix", "ach", "swift"]>;
    accountNumber: z.ZodString;
    routingNumber: z.ZodOptional<z.ZodString>;
    bankCode: z.ZodOptional<z.ZodString>;
    bankName: z.ZodString;
    bankCountry: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "iban" | "pix" | "ach" | "swift";
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
}, {
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    type: "iban" | "pix" | "ach" | "swift";
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
}>;
export type CreateAccountNumberRequest = z.infer<typeof CreateAccountNumberRequestSchema>;
//# sourceMappingURL=account.d.ts.map