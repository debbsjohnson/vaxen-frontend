export type BackendResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
};

export type BackendUserRole = 'owner' | 'manager' | 'finance' | 'viewer' | 'admin';
export type ApprovalDecision = 'approved' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type IsoDateTimeString = string;

export type BackendPaginatedResponse<T> = BackendResponse<T[]> & {
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: BackendUserRole;
  isDirector: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: IsoDateTimeString | null;
  isActive?: boolean;
  createdAt?: IsoDateTimeString;
  updatedAt?: IsoDateTimeString;
};

export type AuthSession = {
  csrfToken: string;
  user: AuthUser;
  requiresMfa?: boolean;
  message?: string;
};

export type LoginMfaChallenge = {
  requiresMfa: true;
  challengeId: string;
  expiresInSec: number;
};

export type KybStatus = 'pending' | 'approved' | 'rejected' | 'requires_info';

export type BackendOrganization = {
  id: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId?: string | null;
  country: string;
  address: Record<string, unknown>;
  kybStatus: KybStatus;
  kybSubmittedAt?: IsoDateTimeString | null;
  kybApprovedAt?: IsoDateTimeString | null;
  settings: Record<string, unknown>;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendWalletType = 'fiat' | 'crypto';

export type BackendWallet = {
  id: string;
  organizationId: string;
  type: BackendWalletType;
  currency: string;
  balance: string;
  availableBalance: string;
  pendingBalance: string;
  isActive: boolean;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendWeb3Wallet = {
  id: string;
  organizationId: string;
  address: string;
  network: string;
  label?: string;
  isActive: boolean;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type WalletBalanceData = {
  walletId: string;
  balance: string;
  availableBalance: string;
  pendingBalance: string;
  currency: string;
};

export type BackendAccountType = 'iban' | 'pix' | 'ach' | 'swift';

export type BackendAccount = {
  id: string;
  organizationId: string;
  name: string;
  currency: string;
  type: BackendAccountType;
  accountNumber: string;
  routingNumber?: string | null;
  bankCode?: string | null;
  bankName: string;
  bankCountry: string;
  isActive: boolean;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendQuoteType = 'spot' | 'auto_convert' | 'limit';

export type BackendQuote = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  spread: string;
  fee: string;
  feeCurrency: string;
  expiresAt: IsoDateTimeString;
  type: BackendQuoteType;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendConversionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type BackendConversionOrder = {
  id: string;
  organizationId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  spread: string;
  fee: string;
  initiatedById?: string | null;
  status: BackendConversionStatus;
  type: 'market' | 'limit';
  limitPrice?: string | null;
  executedAt?: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendOrderSummary = {
  id: string;
  organizationId?: string;
  status: BackendConversionStatus;
  amount: string;
  fromCurrency?: string;
  toCurrency?: string;
};

export type BackendBeneficiary = {
  id: string;
  organizationId: string;
  name: string;
  type: 'bank' | 'crypto';
  accountNumber?: string | null;
  routingNumber?: string | null;
  bankCode?: string | null;
  bankName?: string | null;
  bankCountry?: string | null;
  address?: string | null;
  currency: string;
  network?: string | null;
  isActive: boolean;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendPayoutType = 'bank' | 'crypto';

export type BackendPayout = {
  id: string;
  organizationId: string;
  type: BackendPayoutType;
  amount: string;
  currency: string;
  beneficiaryId: string;
  reference?: string | null;
  description?: string | null;
  status: BackendConversionStatus;
  initiatedById?: string | null;
  fee: string;
  executedAt?: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type PayoutFeesResult = {
  fee: string;
  total: string;
  currency: string;
  provider?: string;
  estimatedArrival?: string;
};

export type CryptoAddress = {
  id: string;
  organizationId: string;
  currency: string;
  address: string;
};

export type CreateCryptoAddressInput = {
  currency?: string;
  network?: string;
  label?: string;
  walletId?: string;
};

export type CreateCryptoAddressResult = {
  id: string;
  address: string;
  message: string;
};

export type CryptoWithdrawInput = {
  walletId?: string;
  amount?: string;
  currency?: string;
  address?: string;
  network?: string;
  reference?: string;
};

export type CryptoWithdrawResult = {
  id: string;
  status: string;
  message: string;
};

export type BackendApprovalVote = {
  id: string;
  approvalRequestId: string;
  voterId: string;
  decision: ApprovalDecision;
  comment?: string;
  createdAt: IsoDateTimeString;
};

export type BackendApprovalRequest = {
  id: string;
  organizationId: string;
  actionType: string;
  resourceId: string;
  resourceType: string;
  requestedById: string;
  status: ApprovalStatus;
  requiredCount: number;
  currentCount: number;
  payload: Record<string, unknown>;
  expiresAt?: IsoDateTimeString | null;
  completedAt?: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  votes?: BackendApprovalVote[];
};

export type BackendStatement = {
  id: string;
  organizationId: string;
  type: 'pdf' | 'csv';
  period: Record<string, unknown>;
  currency: string;
  fileUrl: string;
  fileSize: number;
  status: 'generating' | 'ready' | 'failed';
  generatedAt?: IsoDateTimeString | null;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendAuditLog = {
  id: string;
  organizationId: string;
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: IsoDateTimeString;
};

export type BackendProvider = {
  name: string;
  status: 'configured' | string;
};

export type BackendUserSummary = Pick<AuthUser, 'id' | 'email' | 'role'>;

export type BackendPlatformSetting = {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedBy: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendFeatureFlag = {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  updatedBy: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendExchangeRate = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  spread: string;
  isActive: boolean;
  updatedBy: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type BackendAccessRequestStatus = 'pending' | 'approved' | 'rejected';

export type BackendAccessRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  country: string;
  markets: unknown;
  annualVolume: string;
  useCase: string;
  website: string;
  notes: string;
  status: BackendAccessRequestStatus;
  reviewedBy?: string | null;
  reviewedAt?: IsoDateTimeString | null;
  reviewNote: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type SeedExchangeRateResult = {
  from: string;
  to: string;
  rate: string;
  status: 'created' | 'updated' | 'failed';
  error?: string;
};

export type AccessRequestDecisionResponse = {
  id: string;
  status: BackendAccessRequestStatus;
  email?: string;
  message: string;
};

export type IdMessageResponse = {
  id: string;
  message: string;
};

export type KybSubmitResponse = {
  referenceId: string;
  status: string;
  organizationId: string;
  message: string;
};

export type KybStatusResponse = {
  organizationId: string;
  status: string;
  referenceId?: string;
  reason?: string;
};

export type RequestAccessInput = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  country?: string;
  markets?: string[];
  annualVolume?: string;
  useCase?: string;
  website?: string;
  notes?: string;
  honeypot?: string;
};

export type RegisterInput = {
  inviteToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
  mfaCode?: string;
};

export type ConfirmMfaInput = {
  code: string;
};

export type UpdateOrganizationInput = {
  name?: string;
  legalName?: string;
  taxId?: string;
  country?: string;
};

export type KybAddress = {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

export type KybDirector = {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  dob?: string;
  nationality?: string;
};

export type KybDocument = {
  type: string;
  number?: string;
  country?: string;
  expiresAt?: string;
};

export type SubmitKybInput = {
  legalName: string;
  registrationNumber: string;
  taxId?: string;
  country: string;
  address: KybAddress;
  directors: KybDirector[];
  documents?: KybDocument[];
};

export type CreateWalletInput = {
  type: 'fiat' | 'crypto';
  currency?: string;
  network?: string;
  label?: string;
};

export type CreateAccountInput = {
  name: string;
  currency: string;
  type: 'iban' | 'pix' | 'ach' | 'swift';
  accountNumber: string;
  routingNumber?: string;
  bankCode?: string;
  bankName: string;
  bankCountry: string;
};

export type CreateQuoteInput = {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  side: 'buy' | 'sell';
};

export type CreateConversionInput = {
  quoteId: string;
};

export type CreateOrderInput = Record<string, unknown>;

export type CreateBeneficiaryInput = {
  name: string;
  type: 'bank' | 'crypto';
  currency: string;
  accountNumber?: string;
  routingNumber?: string;
  bankCode?: string;
  bankName?: string;
  bankCountry?: string;
  address?: string;
  network?: string;
};

export type UpdateBeneficiaryInput = {
  name?: string;
  currency?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankCode?: string;
  bankName?: string;
  bankCountry?: string;
  address?: string;
  network?: string;
};

export type CreatePayoutInput = {
  beneficiaryId: string;
  amount: string;
  currency: string;
  reference?: string;
  description?: string;
};

export type VoteOnApprovalInput = {
  decision: ApprovalDecision;
  comment?: string;
};

export type UpdateApprovalPolicyInput = {
  actionType: string;
  requiredApprovals: number;
};

export type UpsertPlatformSettingInput = {
  key: string;
  value: string;
  category: string;
};

export type SetFeatureFlagInput = {
  name: string;
  enabled: boolean;
  description?: string;
};

export type UpsertExchangeRateInput = {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  spread?: string;
};

export type SeedExchangeRatesInput = {
  base: string;
  targets: string[];
  defaultSpread?: string;
};

export type RejectReasonInput = {
  reason?: string;
};

export type PayoutFeesQuery = {
  amount: string;
  currency: string;
  country: string;
  method: string;
};

export type RateQuery = {
  from: string;
  to: string;
};

export type PaginatedQuery = {
  page?: number;
  limit?: number;
};

export type AuditLogsQuery = PaginatedQuery;

export type AccessRequestsQuery = {
  status?: 'pending' | 'approved' | 'rejected';
};
