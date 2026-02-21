import { z } from 'zod';
export declare const BeneficiaryBankSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    name: z.ZodString;
    accountNumber: z.ZodString;
    routingNumber: z.ZodOptional<z.ZodString>;
    bankCode: z.ZodOptional<z.ZodString>;
    bankName: z.ZodString;
    bankCountry: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
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
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    createdAt: Date;
    updatedAt: Date;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type BeneficiaryBank = z.infer<typeof BeneficiaryBankSchema>;
export declare const BeneficiaryCryptoSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    name: z.ZodString;
    address: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    network: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    network: string;
}, {
    id: string;
    organizationId: string;
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    createdAt: Date;
    updatedAt: Date;
    address: string;
    network: string;
    isActive?: boolean | undefined;
}>;
export type BeneficiaryCrypto = z.infer<typeof BeneficiaryCryptoSchema>;
export declare const CreateBeneficiaryBankRequestSchema: z.ZodObject<{
    name: z.ZodString;
    accountNumber: z.ZodString;
    routingNumber: z.ZodOptional<z.ZodString>;
    bankCode: z.ZodOptional<z.ZodString>;
    bankName: z.ZodString;
    bankCountry: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
}, {
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    accountNumber: string;
    bankName: string;
    bankCountry: string;
    routingNumber?: string | undefined;
    bankCode?: string | undefined;
}>;
export type CreateBeneficiaryBankRequest = z.infer<typeof CreateBeneficiaryBankRequestSchema>;
export declare const CreateBeneficiaryCryptoRequestSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", "RUB", "TRY", "ZAR", "BRL", "MXN", "INR", "KRW", "SGD", "HKD", "NZD", "THB", "MYR", "PHP", "IDR", "VND", "BTC", "ETH", "USDC", "USDT"]>;
    network: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    address: string;
    network: string;
}, {
    name: string;
    currency: "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "HRK" | "RUB" | "TRY" | "ZAR" | "BRL" | "MXN" | "INR" | "KRW" | "SGD" | "HKD" | "NZD" | "THB" | "MYR" | "PHP" | "IDR" | "VND" | "BTC" | "ETH" | "USDC" | "USDT";
    address: string;
    network: string;
}>;
export type CreateBeneficiaryCryptoRequest = z.infer<typeof CreateBeneficiaryCryptoRequestSchema>;
//# sourceMappingURL=beneficiary.d.ts.map