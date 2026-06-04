import { createFeatureSelector, createSelector } from '@ngrx/store';

import { transactionsAdapter, TransactionsState } from './transactions.reducer';

export const selectTransactionsState =
  createFeatureSelector<TransactionsState>('transactions');

const { selectAll } = transactionsAdapter.getSelectors();

export const selectAllTransactions = createSelector(selectTransactionsState, selectAll);

export const selectTransactionsLoading = createSelector(
  selectTransactionsState,
  (state) => state.loading,
);

export const selectTransactionsError = createSelector(
  selectTransactionsState,
  (state) => state.error,
);
