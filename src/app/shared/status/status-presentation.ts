import {
  BeneficiaryStatus,
  CardPurchaseStatus,
  CardStatus,
  CardType,
  TransactionStatus,
} from '../../core/models/banking';
import { StatusBadgeVariant } from '../components/status-badge/status-badge';

/**
 * Apresentação visual de um status: rótulo legível + variante do badge.
 * Fonte única de verdade consumida pelos pipes de status e pelos componentes
 * que montam rótulos em TypeScript (ex.: dashboard).
 */
export interface StatusPresentation {
  label: string;
  variant: StatusBadgeVariant;
}

export const TRANSACTION_STATUS: Record<TransactionStatus, StatusPresentation> = {
  completed: { label: 'Concluído', variant: 'success' },
  processing: { label: 'Processando', variant: 'info' },
  scheduled: { label: 'Agendado', variant: 'warning' },
};

export const BENEFICIARY_STATUS: Record<BeneficiaryStatus, StatusPresentation> = {
  active: { label: 'Ativo', variant: 'success' },
  pending: { label: 'Pendente', variant: 'warning' },
};

export const CARD_STATUS: Record<CardStatus, StatusPresentation> = {
  active: { label: 'Ativo', variant: 'success' },
  blocked: { label: 'Bloqueado', variant: 'warning' },
};

export const PURCHASE_STATUS: Record<CardPurchaseStatus, StatusPresentation> = {
  approved: { label: 'Aprovada', variant: 'success' },
  processing: { label: 'Processando', variant: 'info' },
};

export const CARD_TYPE_LABEL: Record<CardType, string> = {
  physical: 'Cartão físico',
  virtual: 'Cartão virtual',
};
