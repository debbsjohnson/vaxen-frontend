import { z } from 'zod';
export declare const AuditLogSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    action: z.ZodString;
    resource: z.ZodString;
    resourceId: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    action: string;
    resource: string;
    userId?: string | undefined;
    resourceId?: string | undefined;
    details?: Record<string, any> | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}, {
    id: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    action: string;
    resource: string;
    userId?: string | undefined;
    resourceId?: string | undefined;
    details?: Record<string, any> | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
}>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export declare const WebhookEventSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    organizationId: z.ZodString;
    provider: z.ZodString;
    eventType: z.ZodString;
    payload: z.ZodRecord<z.ZodString, z.ZodAny>;
    status: z.ZodEnum<["pending", "processed", "failed"]>;
    processedAt: z.ZodOptional<z.ZodDate>;
    retryCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    status: "pending" | "processed" | "failed";
    createdAt: Date;
    updatedAt: Date;
    provider: string;
    eventType: string;
    payload: Record<string, any>;
    retryCount: number;
    processedAt?: Date | undefined;
}, {
    id: string;
    organizationId: string;
    status: "pending" | "processed" | "failed";
    createdAt: Date;
    updatedAt: Date;
    provider: string;
    eventType: string;
    payload: Record<string, any>;
    processedAt?: Date | undefined;
    retryCount?: number | undefined;
}>;
export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
//# sourceMappingURL=audit.d.ts.map