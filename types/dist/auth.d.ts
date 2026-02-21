import { z } from 'zod';
export declare const UserRoleSchema: z.ZodEnum<["owner", "manager", "finance", "viewer"]>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    mfaCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
}, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export declare const LoginResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        role: z.ZodEnum<["owner", "manager", "finance", "viewer"]>;
        organizationId: z.ZodString;
        mfaEnabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        organizationId: string;
        email: string;
        role: "owner" | "manager" | "finance" | "viewer";
        mfaEnabled: boolean;
    }, {
        id: string;
        organizationId: string;
        email: string;
        role: "owner" | "manager" | "finance" | "viewer";
        mfaEnabled: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        organizationId: string;
        email: string;
        role: "owner" | "manager" | "finance" | "viewer";
        mfaEnabled: boolean;
    };
}, {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        organizationId: string;
        email: string;
        role: "owner" | "manager" | "finance" | "viewer";
        mfaEnabled: boolean;
    };
}>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export declare const RefreshTokenRequestSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export declare const MfaSetupRequestSchema: z.ZodObject<{
    secret: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    secret: string;
}, {
    code: string;
    secret: string;
}>;
export type MfaSetupRequest = z.infer<typeof MfaSetupRequestSchema>;
export declare const MfaVerifyRequestSchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
export type MfaVerifyRequest = z.infer<typeof MfaVerifyRequestSchema>;
//# sourceMappingURL=auth.d.ts.map