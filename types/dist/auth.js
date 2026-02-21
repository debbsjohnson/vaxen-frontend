import { z } from 'zod';
// User roles
export const UserRoleSchema = z.enum(['owner', 'manager', 'finance', 'viewer']);
// Auth schemas
export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    mfaCode: z.string().optional(),
});
export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string().email(),
        role: UserRoleSchema,
        organizationId: z.string(),
        mfaEnabled: z.boolean(),
    }),
});
export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string(),
});
export const MfaSetupRequestSchema = z.object({
    secret: z.string(),
    code: z.string().length(6),
});
export const MfaVerifyRequestSchema = z.object({
    code: z.string().length(6),
});
//# sourceMappingURL=auth.js.map