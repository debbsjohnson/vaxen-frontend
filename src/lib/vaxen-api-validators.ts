import { z } from 'zod';

const PaginationSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  organizationId: z.string(),
  role: z.enum(['owner', 'manager', 'finance', 'viewer', 'admin']),
  isDirector: z.boolean(),
  mfaEnabled: z.boolean(),
  lastLoginAt: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

const AuthSessionSchema = z.object({
  csrfToken: z.string(),
  user: AuthUserSchema,
  requiresMfa: z.boolean().optional(),
  message: z.string().optional(),
});

const LoginMfaChallengeSchema = z.object({
  requiresMfa: z.literal(true),
  challengeId: z.string(),
  expiresInSec: z.number(),
});

const WalletSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  type: z.enum(['fiat', 'crypto']),
  currency: z.string(),
  balance: z.string(),
  availableBalance: z.string(),
  pendingBalance: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const PayoutSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  type: z.enum(['bank', 'crypto']),
  amount: z.string(),
  currency: z.string(),
  beneficiaryId: z.string(),
  reference: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
  initiatedById: z.string().optional().nullable(),
  fee: z.string(),
  executedAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const AuthSessionOrChallengeSchema = z.union([AuthSessionSchema, LoginMfaChallengeSchema]);

const WalletListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(WalletSchema),
  error: z.string().optional(),
});

const WalletResponseSchema = z.object({
  success: z.boolean(),
  data: WalletSchema,
  error: z.string().optional(),
});

const PayoutListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(PayoutSchema),
  error: z.string().optional(),
});

const PayoutResponseSchema = z.object({
  success: z.boolean(),
  data: PayoutSchema,
  error: z.string().optional(),
});

const LoginResponseSchema = z.object({
  success: z.boolean(),
  data: AuthSessionOrChallengeSchema,
  error: z.string().optional(),
});

const AuthSessionResponseSchema = z.object({
  success: z.boolean(),
  data: AuthSessionSchema,
  error: z.string().optional(),
});

const PaginatedAuditResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.record(z.unknown())),
  pagination: PaginationSchema,
  error: z.string().optional(),
});

export function validateLoginResponse<T>(value: T): T {
  return LoginResponseSchema.parse(value) as T;
}

export function validateAuthSessionResponse<T>(value: T): T {
  return AuthSessionResponseSchema.parse(value) as T;
}

export function validateWalletListResponse<T>(value: T): T {
  return WalletListResponseSchema.parse(value) as T;
}

export function validateWalletResponse<T>(value: T): T {
  return WalletResponseSchema.parse(value) as T;
}

export function validatePayoutListResponse<T>(value: T): T {
  return PayoutListResponseSchema.parse(value) as T;
}

export function validatePayoutResponse<T>(value: T): T {
  return PayoutResponseSchema.parse(value) as T;
}

export function validatePaginatedAuditResponse<T>(value: T): T {
  return PaginatedAuditResponseSchema.parse(value) as T;
}
