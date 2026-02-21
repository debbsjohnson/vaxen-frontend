import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["owner", "manager", "finance", "viewer"]>;
    organizationId: z.ZodString;
    mfaEnabled: z.ZodBoolean;
    mfaSecret: z.ZodOptional<z.ZodString>;
    lastLoginAt: z.ZodOptional<z.ZodDate>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    organizationId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    role: "owner" | "manager" | "finance" | "viewer";
    mfaEnabled: boolean;
    firstName: string;
    lastName: string;
    mfaSecret?: string | undefined;
    lastLoginAt?: Date | undefined;
}, {
    id: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    role: "owner" | "manager" | "finance" | "viewer";
    mfaEnabled: boolean;
    firstName: string;
    lastName: string;
    isActive?: boolean | undefined;
    mfaSecret?: string | undefined;
    lastLoginAt?: Date | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const CreateUserRequestSchema: z.ZodObject<{
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["owner", "manager", "finance", "viewer"]>;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: "owner" | "manager" | "finance" | "viewer";
    firstName: string;
    lastName: string;
}, {
    email: string;
    password: string;
    role: "owner" | "manager" | "finance" | "viewer";
    firstName: string;
    lastName: string;
}>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export declare const UpdateUserRequestSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["owner", "manager", "finance", "viewer"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isActive?: boolean | undefined;
    role?: "owner" | "manager" | "finance" | "viewer" | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
}, {
    isActive?: boolean | undefined;
    role?: "owner" | "manager" | "finance" | "viewer" | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
}>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export declare const ChangePasswordRequestSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
//# sourceMappingURL=user.d.ts.map