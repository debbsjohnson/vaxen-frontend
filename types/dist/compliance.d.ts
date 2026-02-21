import { z } from 'zod';
export declare const ComplianceCaseSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    type: z.ZodEnum<["kyb", "kyt", "aml"]>;
    status: z.ZodEnum<["pending", "approved", "rejected", "requires_info"]>;
    provider: z.ZodString;
    providerCaseId: z.ZodString;
    submittedAt: z.ZodDate;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    type: "kyb" | "kyt" | "aml";
    status: "pending" | "approved" | "rejected" | "requires_info";
    createdAt: Date;
    updatedAt: Date;
    provider: string;
    providerCaseId: string;
    submittedAt: Date;
    completedAt?: Date | undefined;
}, {
    id: string;
    organizationId: string;
    type: "kyb" | "kyt" | "aml";
    status: "pending" | "approved" | "rejected" | "requires_info";
    createdAt: Date;
    updatedAt: Date;
    provider: string;
    providerCaseId: string;
    submittedAt: Date;
    completedAt?: Date | undefined;
}>;
export type ComplianceCase = z.infer<typeof ComplianceCaseSchema>;
export declare const ScreeningResultSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    type: z.ZodEnum<["transaction", "address", "entity"]>;
    status: z.ZodEnum<["clean", "flagged", "blocked"]>;
    riskScore: z.ZodNumber;
    provider: z.ZodString;
    details: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    type: "address" | "transaction" | "entity";
    status: "clean" | "flagged" | "blocked";
    createdAt: Date;
    updatedAt: Date;
    details: Record<string, any>;
    provider: string;
    riskScore: number;
}, {
    id: string;
    organizationId: string;
    type: "address" | "transaction" | "entity";
    status: "clean" | "flagged" | "blocked";
    createdAt: Date;
    updatedAt: Date;
    details: Record<string, any>;
    provider: string;
    riskScore: number;
}>;
export type ScreeningResult = z.infer<typeof ScreeningResultSchema>;
//# sourceMappingURL=compliance.d.ts.map