import type {
  BackendBeneficiary,
  BackendPayout,
  BackendWallet,
} from '@/types/backend-api';
import {
  formatAmount,
  getCurrencyName,
  getCurrencySymbol,
  parseAmount,
} from '@/lib/formatters';

export type UiBalance = {
  currency: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  symbol: string;
  flag: string;
  name: string;
};

export type UiTransaction = {
  id: string;
  type: string;
  amount: string;
  currency: string;
  description: string;
  status: string;
  date: string;
  rate?: string;
};

export type UiBeneficiary = {
  id: string;
  name: string;
  email: string;
  type: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  currency: string;
  country: string;
  status: string;
  lastUsed: string;
};

export type UiRecentPayout = {
  id: string;
  beneficiary: string;
  amount: string;
  currency: string;
  type: string;
  status: string;
  date: string;
  reference: string;
  fee: string;
};

export function mapWalletToDashboardBalance(wallet: BackendWallet): UiBalance {
  return {
    currency: wallet.currency,
    amount: formatAmount(wallet.availableBalance),
    change:
      parseAmount(wallet.pendingBalance) > 0
        ? `Pending ${formatAmount(wallet.pendingBalance)}`
        : wallet.isActive
        ? 'Active'
        : 'Inactive',
    changeType: wallet.isActive ? 'positive' : 'negative',
    symbol: getCurrencySymbol(wallet.currency),
    flag: '',
    name: getCurrencyName(wallet.currency),
  };
}

export function mapPayoutToUiTransaction(payout: BackendPayout): UiTransaction {
  return {
    id: payout.id,
    type: 'payout',
    amount: formatAmount(payout.amount),
    currency: payout.currency,
    description: payout.reference || payout.description || `Payout to ${payout.beneficiaryId}`,
    status: payout.status,
    date: payout.createdAt,
    rate: '1.0',
  };
}

export function mapWalletToWalletCard(wallet: BackendWallet) {
  const available = parseAmount(wallet.availableBalance);

  return {
    currency: wallet.currency,
    name: getCurrencyName(wallet.currency),
    flag: '',
    available: formatAmount(wallet.availableBalance),
    total: formatAmount(wallet.balance),
    usdValue: formatAmount(available),
    change:
      parseAmount(wallet.pendingBalance) > 0
        ? `Pending ${formatAmount(wallet.pendingBalance)}`
        : wallet.isActive
        ? 'Active'
        : 'Inactive',
    changeType: wallet.isActive ? ('positive' as const) : ('negative' as const),
  };
}

export function mapBackendBeneficiaryToUi(beneficiary: BackendBeneficiary): UiBeneficiary {
  return {
    id: beneficiary.id,
    name: beneficiary.name,
    email: `${beneficiary.type.toUpperCase()} beneficiary`,
    type: beneficiary.type,
    bankName:
      beneficiary.bankName ||
      (beneficiary.type === 'crypto' ? 'Crypto wallet' : 'Bank account'),
    accountNumber: beneficiary.accountNumber || beneficiary.address || beneficiary.id,
    routingNumber: beneficiary.routingNumber || '',
    currency: beneficiary.currency,
    country: beneficiary.bankCountry || beneficiary.network || getCurrencyName(beneficiary.currency),
    status: beneficiary.isActive ? 'verified' : 'pending',
    lastUsed: beneficiary.updatedAt,
  };
}

export function mapBackendPayoutToUiRecent(
  payout: BackendPayout,
  beneficiaries: UiBeneficiary[]
): UiRecentPayout {
  return {
    id: payout.id,
    beneficiary:
      beneficiaries.find((beneficiary) => beneficiary.id === payout.beneficiaryId)?.name ||
      payout.beneficiaryId,
    amount: formatAmount(payout.amount),
    currency: payout.currency,
    type: payout.type === 'bank' ? 'wire' : 'crypto',
    status: payout.status,
    date: payout.createdAt,
    reference: payout.reference || `PAY-${payout.id.slice(0, 6).toUpperCase()}`,
    fee: formatAmount(payout.fee),
  };
}
