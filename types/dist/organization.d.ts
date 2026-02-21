import { z } from 'zod';
export declare const OrganizationSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    name: z.ZodString;
    legalName: z.ZodString;
    registrationNumber: z.ZodString;
    taxId: z.ZodOptional<z.ZodString>;
    country: z.ZodString;
    address: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    }, {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    }>;
    kybStatus: z.ZodEnum<["pending", "approved", "rejected", "requires_info"]>;
    kybSubmittedAt: z.ZodOptional<z.ZodDate>;
    kybApprovedAt: z.ZodOptional<z.ZodDate>;
    settings: z.ZodObject<{
        defaultCurrency: z.ZodDefault<z.ZodString>;
        timezone: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        notifications: z.ZodObject<{
            email: z.ZodDefault<z.ZodBoolean>;
            sms: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email: boolean;
            sms: boolean;
        }, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        defaultCurrency: string;
        timezone: string;
        language: string;
        notifications: {
            email: boolean;
            sms: boolean;
        };
    }, {
        notifications: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
        };
        defaultCurrency?: string | undefined;
        timezone?: string | undefined;
        language?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    address: {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    };
    legalName: string;
    registrationNumber: string;
    country: string;
    kybStatus: "pending" | "approved" | "rejected" | "requires_info";
    settings: {
        defaultCurrency: string;
        timezone: string;
        language: string;
        notifications: {
            email: boolean;
            sms: boolean;
        };
    };
    taxId?: string | undefined;
    kybSubmittedAt?: Date | undefined;
    kybApprovedAt?: Date | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    address: {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    };
    legalName: string;
    registrationNumber: string;
    country: string;
    kybStatus: "pending" | "approved" | "rejected" | "requires_info";
    settings: {
        notifications: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
        };
        defaultCurrency?: string | undefined;
        timezone?: string | undefined;
        language?: string | undefined;
    };
    taxId?: string | undefined;
    kybSubmittedAt?: Date | undefined;
    kybApprovedAt?: Date | undefined;
}>;
export type Organization = z.infer<typeof OrganizationSchema>;
export declare const CreateOrganizationRequestSchema: z.ZodObject<{
    name: z.ZodString;
    legalName: z.ZodString;
    registrationNumber: z.ZodString;
    taxId: z.ZodOptional<z.ZodString>;
    country: z.ZodString;
    address: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    }, {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    address: {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    };
    legalName: string;
    registrationNumber: string;
    country: string;
    taxId?: string | undefined;
}, {
    name: string;
    address: {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    };
    legalName: string;
    registrationNumber: string;
    country: string;
    taxId?: string | undefined;
}>;
export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;
export declare const UpdateOrganizationRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    legalName: z.ZodOptional<z.ZodString>;
    registrationNumber: z.ZodOptional<z.ZodString>;
    taxId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    country: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    }, {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    address?: {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    } | undefined;
    legalName?: string | undefined;
    registrationNumber?: string | undefined;
    taxId?: string | undefined;
    country?: string | undefined;
}, {
    name?: string | undefined;
    address?: {
        country: string;
        street: string;
        city: string;
        postalCode: string;
        state?: string | undefined;
    } | undefined;
    legalName?: string | undefined;
    registrationNumber?: string | undefined;
    taxId?: string | undefined;
    country?: string | undefined;
}>;
export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationRequestSchema>;
//# sourceMappingURL=organization.d.ts.map