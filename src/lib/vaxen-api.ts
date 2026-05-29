import {
  deleteJson,
  getJson,
  postJson,
  putJson,
} from '@/lib/client-api';
import {
  validateAuthSessionResponse,
  validateLoginResponse,
  validatePaginatedAuditResponse,
  validatePayoutListResponse,
  validatePayoutResponse,
  validateWalletListResponse,
  validateWalletResponse,
} from '@/lib/vaxen-api-validators';
import type {
  AccessRequestDecisionResponse,
  AccessRequestsQuery,
  AuthSession,
  AuditLogsQuery,
  BackendAccessRequest,
  BackendApprovalRequest,
  BackendAccount,
  BackendAuditLog,
  BackendBeneficiary,
  BackendConversionOrder,
  BackendExchangeRate,
  BackendFeatureFlag,
  BackendOrderSummary,
  BackendOrganization,
  BackendPaginatedResponse,
  BackendPayout,
  BackendPlatformSetting,
  BackendProvider,
  BackendResponse,
  BackendStatement,
  BackendUserSummary,
  BackendWallet,
  BackendWeb3Wallet,
  ConfirmMfaInput,
  CreateAccountInput,
  CreateBeneficiaryInput,
  CreateConversionInput,
  CreateCryptoAddressInput,
  CreateCryptoAddressResult,
  CreateOrderInput,
  CreatePayoutInput,
  CreateQuoteInput,
  CreateWalletInput,
  CryptoAddress,
  CryptoWithdrawInput,
  CryptoWithdrawResult,
  IdMessageResponse,
  KybStatusResponse,
  KybSubmitResponse,
  LoginInput,
  LoginMfaChallenge,
  PaginatedQuery,
  PayoutFeesResult,
  PayoutFeesQuery,
  RateQuery,
  RegisterInput,
  RejectReasonInput,
  RequestAccessInput,
  SeedExchangeRateResult,
  SeedExchangeRatesInput,
  SetFeatureFlagInput,
  SubmitKybInput,
  UpdateApprovalPolicyInput,
  UpdateBeneficiaryInput,
  UpdateOrganizationInput,
  UpsertExchangeRateInput,
  UpsertPlatformSettingInput,
  VoteOnApprovalInput,
  WalletBalanceData,
  BackendQuote,
} from '@/types/backend-api';

type HeadersOptions = {
  csrfToken?: string;
};

const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

function apiV1(path: string) {
  if (path.startsWith('/')) {
    return `${API_PREFIX}${path}`;
  }

  return `${API_PREFIX}/${path}`;
}

function getV1<T>(path: string) {
  return getJson<T>(apiV1(path));
}

function postV1<TResponse, TBody>(path: string, body: TBody, options?: HeadersOptions) {
  return postJson<TResponse, TBody>(apiV1(path), body, withCsrfHeader(options));
}

function putV1<TResponse, TBody>(path: string, body: TBody, options?: HeadersOptions) {
  return putJson<TResponse, TBody>(apiV1(path), body, withCsrfHeader(options));
}

function deleteV1<TResponse>(path: string, options?: HeadersOptions) {
  return deleteJson<TResponse>(apiV1(path), withCsrfHeader(options));
}

function withCsrfHeader(options?: HeadersOptions) {
  if (!options?.csrfToken) {
    return undefined;
  }

  return {
    headers: {
      'x-csrf-token': options.csrfToken,
    },
  };
}

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const value = query.toString();
  return value ? `?${value}` : '';
}

export const vaxenApi = {
  auth: {
    requestAccess: (payload: RequestAccessInput) =>
      postV1<BackendResponse<{ message: string }>, RequestAccessInput>('/auth/request-access', payload),

    register: async (payload: RegisterInput, options?: HeadersOptions) => {
      const response = await postV1<BackendResponse<AuthSession>, RegisterInput>('/auth/register', payload, options);
      return validateAuthSessionResponse(response);
    },

    // login / logout hit the dedicated Next.js handlers (NOT the
    // /api/v1 catch-all) — those handlers talk to Supabase server-side
    // and manage the httpOnly access + refresh cookies for us.
    login: async (payload: LoginInput) => {
      const response = await postJson<BackendResponse<AuthSession | LoginMfaChallenge>, LoginInput>('/api/auth/login', payload);
      return validateLoginResponse(response);
    },

    // Refresh is handled transparently by the /api/v1 proxy on 401 —
    // this stays as a no-op trigger that any client code may call.
    refresh: () => Promise.resolve({ success: true } as BackendResponse<{ message?: string }>),

    logout: (_options?: HeadersOptions) =>
      postJson<BackendResponse<{ message: string }>, Record<string, never>>('/api/auth/logout', {}),
  },

  mfa: {
    enroll: (options?: HeadersOptions) =>
      postV1<
        BackendResponse<{ qrCodeUrl: string; secret: string; backupCode: string; message: string }>,
        Record<string, never>
      >('/mfa/enroll', {}, options),

    confirm: (payload: ConfirmMfaInput, options?: HeadersOptions) =>
      postV1<BackendResponse<{ message: string }>, ConfirmMfaInput>('/mfa/confirm', payload, options),

    disable: (options?: HeadersOptions) =>
      postV1<BackendResponse<{ message: string }>, Record<string, never>>('/mfa/disable', {}, options),
  },

  organizations: {
    list: () => getV1<BackendResponse<BackendOrganization>>('/organizations'),
    getById: (id: string) => getV1<BackendResponse<BackendOrganization>>(`/organizations/${id}`),
    update: (id: string, payload: UpdateOrganizationInput, options?: HeadersOptions) =>
      putV1<BackendResponse<BackendOrganization>, UpdateOrganizationInput>(`/organizations/${id}`, payload, options),
  },

  kyb: {
    submit: (payload: SubmitKybInput, options?: HeadersOptions) =>
      postV1<BackendResponse<KybSubmitResponse>, SubmitKybInput>('/kyb/submit', payload, options),
    status: () => getV1<BackendResponse<KybStatusResponse>>('/kyb/status'),
  },

  wallets: {
    list: async () => {
      const response = await getV1<BackendResponse<BackendWallet[]>>('/wallets');
      return validateWalletListResponse(response);
    },
    web3: () => getV1<BackendResponse<BackendWeb3Wallet[]>>('/wallets/web3'),
    getById: async (id: string) => {
      const response = await getV1<BackendResponse<BackendWallet>>(`/wallets/${id}`);
      return validateWalletResponse(response);
    },
    create: async (payload: CreateWalletInput, options?: HeadersOptions) => {
      const response = await postV1<BackendResponse<BackendWallet | BackendWeb3Wallet>, CreateWalletInput>(
        '/wallets',
        payload,
        options
      );
      return validateWalletResponse(response as BackendResponse<BackendWallet>);
    },
    balance: (id: string) => getV1<BackendResponse<WalletBalanceData>>(`/wallets/${id}/balance`),
  },

  accounts: {
    list: () => getV1<BackendResponse<BackendAccount[]>>('/accounts'),
    getById: (id: string) => getV1<BackendResponse<BackendAccount>>(`/accounts/${id}`),
    create: (payload: CreateAccountInput, options?: HeadersOptions) =>
      postV1<BackendResponse<BackendAccount>, CreateAccountInput>('/accounts', payload, options),
  },

  quotes: {
    create: (payload: CreateQuoteInput, options?: HeadersOptions) =>
      postV1<BackendResponse<BackendQuote>, CreateQuoteInput>('/quotes', payload, options),
    getById: (id: string) => getV1<BackendResponse<BackendQuote>>(`/quotes/${id}`),
  },

  conversions: {
    list: () => getV1<BackendResponse<BackendOrderSummary[]>>('/conversions'),
    getById: (id: string) => getV1<BackendResponse<BackendOrderSummary>>(`/conversions/${id}`),
    create: (payload: CreateConversionInput, options?: HeadersOptions) =>
      postV1<BackendResponse<BackendConversionOrder>, CreateConversionInput>('/conversions', payload, options),
    pairs: () => getV1<BackendResponse<string[]>>('/conversions/pairs'),
    rate: (params: RateQuery) =>
      getV1<BackendResponse<string | Record<string, unknown>>>(`/conversions/rate${queryString(params)}`),
  },

  orders: {
    list: () => getV1<BackendResponse<BackendOrderSummary[]>>('/orders'),
    open: () => getV1<BackendResponse<BackendOrderSummary[]>>('/orders/open'),
    getById: (id: string) => getV1<BackendResponse<BackendOrderSummary>>(`/orders/${id}`),
    create: (payload: CreateOrderInput, options?: HeadersOptions) =>
      postV1<BackendResponse<IdMessageResponse>, CreateOrderInput>('/orders', payload, options),
    cancel: (id: string, options?: HeadersOptions) =>
      putV1<BackendResponse<IdMessageResponse>, Record<string, never>>(`/orders/${id}/cancel`, {}, options),
  },

  beneficiaries: {
    list: () => getV1<BackendResponse<BackendBeneficiary[]>>('/beneficiaries'),
    getById: (id: string) => getV1<BackendResponse<BackendBeneficiary>>(`/beneficiaries/${id}`),
    create: (payload: CreateBeneficiaryInput, options?: HeadersOptions) =>
      postV1<BackendResponse<BackendBeneficiary>, CreateBeneficiaryInput>('/beneficiaries', payload, options),
    update: (id: string, payload: UpdateBeneficiaryInput, options?: HeadersOptions) =>
      putV1<BackendResponse<BackendBeneficiary>, UpdateBeneficiaryInput>(`/beneficiaries/${id}`, payload, options),
    remove: (id: string, options?: HeadersOptions) =>
      deleteV1<BackendResponse<{ message: string }>>(`/beneficiaries/${id}`, options),
  },

  payouts: {
    list: async () => {
      const response = await getV1<BackendResponse<BackendPayout[]>>('/payouts');
      return validatePayoutListResponse(response);
    },
    getById: async (id: string) => {
      const response = await getV1<BackendResponse<BackendPayout>>(`/payouts/${id}`);
      return validatePayoutResponse(response);
    },
    create: async (payload: CreatePayoutInput, options?: HeadersOptions) => {
      const response = await postV1<BackendResponse<BackendPayout>, CreatePayoutInput>('/payouts', payload, options);
      return validatePayoutResponse(response);
    },
    fees: (params: PayoutFeesQuery) =>
      getV1<BackendResponse<PayoutFeesResult>>(`/payouts/fees${queryString(params)}`),
  },

  crypto: {
    addresses: () => getV1<BackendResponse<CryptoAddress[]>>('/crypto/addresses'),
    createAddress: (payload: CreateCryptoAddressInput, options?: HeadersOptions) =>
      postV1<BackendResponse<CreateCryptoAddressResult>, CreateCryptoAddressInput>('/crypto/addresses', payload, options),
    withdraw: (payload: CryptoWithdrawInput, options?: HeadersOptions) =>
      postV1<BackendResponse<CryptoWithdrawResult>, CryptoWithdrawInput>('/crypto/withdraw', payload, options),
  },

  approvals: {
    pending: () => getV1<BackendResponse<BackendApprovalRequest[]>>('/approvals/pending'),
    getById: (id: string) => getV1<BackendResponse<BackendApprovalRequest>>(`/approvals/${id}`),
    vote: (id: string, payload: VoteOnApprovalInput, options?: HeadersOptions) =>
      postV1<BackendResponse<{ message: string }>, VoteOnApprovalInput>(`/approvals/${id}/vote`, payload, options),
    policy: (payload: UpdateApprovalPolicyInput, options?: HeadersOptions) =>
      putV1<BackendResponse<{ message: string }>, UpdateApprovalPolicyInput>('/approvals/policy', payload, options),
  },

  statements: {
    list: () => getV1<BackendResponse<BackendStatement[]>>('/statements'),
    getById: (id: string) => getV1<BackendResponse<BackendStatement>>(`/statements/${id}`),
  },

  reports: {
    fxPnl: () => getV1<BackendResponse<Record<string, unknown>>>('/reports/fx-pnl'),
    transactions: () => getV1<BackendResponse<Record<string, unknown>>>('/reports/transactions'),
    balances: () => getV1<BackendResponse<Record<string, unknown>>>('/reports/balances'),
    auditLogs: async (query: AuditLogsQuery = {}) => {
      const response = await getV1<BackendPaginatedResponse<BackendAuditLog>>(`/audit/logs${queryString(query)}`);
      return validatePaginatedAuditResponse(response);
    },
  },

  providers: {
    list: () => getV1<BackendResponse<BackendProvider[]>>('/providers'),
    getById: (id: string) => getV1<BackendResponse<BackendProvider>>(`/providers/${id}`),
  },

  admin: {
    users: {
      list: (query: PaginatedQuery = {}) =>
        getV1<BackendPaginatedResponse<BackendUserSummary>>(`/admin/users${queryString(query)}`),
      getById: (id: string) => getV1<BackendResponse<BackendUserSummary>>(`/admin/users/${id}`),
      update: (id: string, payload: Record<string, unknown>, options?: HeadersOptions) =>
        putV1<BackendResponse<IdMessageResponse>, Record<string, unknown>>(`/admin/users/${id}`, payload, options),
      remove: (id: string, options?: HeadersOptions) =>
        deleteV1<BackendResponse<IdMessageResponse>>(`/admin/users/${id}`, options),
    },

    organizations: {
      list: (query: PaginatedQuery = {}) =>
        getV1<BackendPaginatedResponse<BackendOrganization>>(`/admin/organizations${queryString(query)}`),
      approve: (id: string, options?: HeadersOptions) =>
        postV1<BackendResponse<AccessRequestDecisionResponse>, Record<string, never>>(`/admin/organizations/${id}/approve`, {}, options),
      reject: (id: string, payload: RejectReasonInput, options?: HeadersOptions) =>
        postV1<BackendResponse<AccessRequestDecisionResponse>, RejectReasonInput>(`/admin/organizations/${id}/reject`, payload, options),
    },

    settings: {
      list: (category?: string) =>
        getV1<BackendResponse<BackendPlatformSetting[]>>(`/admin/settings${queryString({ category })}`),
      update: (payload: UpsertPlatformSettingInput, options?: HeadersOptions) =>
        putV1<BackendResponse<{ message: string }>, UpsertPlatformSettingInput>('/admin/settings', payload, options),
    },

    features: {
      list: () => getV1<BackendResponse<BackendFeatureFlag[]>>('/admin/features'),
      update: (payload: SetFeatureFlagInput, options?: HeadersOptions) =>
        putV1<BackendResponse<{ message: string }>, SetFeatureFlagInput>('/admin/features', payload, options),
    },

    exchangeRates: {
      list: () => getV1<BackendResponse<BackendExchangeRate[]>>('/admin/exchange-rates'),
      upsert: (payload: UpsertExchangeRateInput, options?: HeadersOptions) =>
        putV1<BackendResponse<{ message: string }>, UpsertExchangeRateInput>('/admin/exchange-rates', payload, options),
      seed: (payload: SeedExchangeRatesInput, options?: HeadersOptions) =>
        postV1<BackendResponse<{ message: string; results: SeedExchangeRateResult[] }>, SeedExchangeRatesInput>(
          '/admin/exchange-rates/seed',
          payload,
          options
        ),
    },

    accessRequests: {
      list: (query: AccessRequestsQuery = {}) =>
        getV1<BackendResponse<BackendAccessRequest[]>>(`/admin/access-requests${queryString(query)}`),
      approve: (id: string, options?: HeadersOptions) =>
        postV1<BackendResponse<AccessRequestDecisionResponse>, Record<string, never>>(`/admin/access-requests/${id}/approve`, {}, options),
      reject: (id: string, payload: RejectReasonInput, options?: HeadersOptions) =>
        postV1<BackendResponse<AccessRequestDecisionResponse>, RejectReasonInput>(`/admin/access-requests/${id}/reject`, payload, options),
    },
  },

  health: () =>
    getJson<{ status: string; timestamp: string; environment?: string | undefined }>('/api/health'),
};
