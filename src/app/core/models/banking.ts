export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'scheduled' | 'processing';
export type BeneficiaryStatus = 'active' | 'pending';
export type CardStatus = 'active' | 'blocked';
export type CardType = 'physical' | 'virtual';
export type TransferStatus = 'completed' | 'scheduled';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface Account {
  id: string;
  holderName: string;
  branch: string;
  number: string;
  balance: number;
  currency: 'BRL';
  incomeThisMonth: number;
  outcomeThisMonth: number;
}

export interface Transaction {
  id: string;
  description: string;
  counterparty: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: string;
  occurredAt: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  document: string;
  pixKey: string;
  status: BeneficiaryStatus;
  createdAt: string;
}

export interface CreateBeneficiaryPayload {
  name: string;
  bank: string;
  document: string;
  pixKey: string;
}

export interface UpdateBeneficiaryPayload {
  name?: string;
  bank?: string;
  document?: string;
  pixKey?: string;
  status?: BeneficiaryStatus;
}

export interface Transfer {
  id: string;
  beneficiaryId: string;
  amount: number;
  description: string;
  status: TransferStatus;
  receiptCode: string;
  createdAt: string;
}

export interface CreateTransferPayload {
  beneficiaryId: string;
  amount: number;
  description: string;
}

export interface Card {
  id: string;
  holderName: string;
  finalDigits: string;
  type: CardType;
  status: CardStatus;
  limit: number;
  availableLimit: number;
  dueDay: number;
}

export interface UpdateCardPayload {
  status?: CardStatus;
  availableLimit?: number;
}
