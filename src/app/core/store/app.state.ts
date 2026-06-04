import { AccountState } from './account/account.reducer';
import { AuthState } from './auth/auth.reducer';
import { BeneficiariesState } from './beneficiaries/beneficiaries.reducer';
import { CardsState } from './cards/cards.reducer';
import { TransactionsState } from './transactions/transactions.reducer';
import { TransfersState } from './transfers/transfers.reducer';

export interface AppState {
  auth: AuthState;
  account: AccountState;
  transactions: TransactionsState;
  beneficiaries: BeneficiariesState;
  transfers: TransfersState;
  cards: CardsState;
}
