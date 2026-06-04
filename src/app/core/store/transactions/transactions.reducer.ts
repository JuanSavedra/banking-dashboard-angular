import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Transaction } from '../../models/banking';
import {
  loadTransactions,
  loadTransactionsFailure,
  loadTransactionsSuccess,
} from './transactions.actions';

export interface TransactionsState extends EntityState<Transaction> {
  loading: boolean;
  error: boolean;
}

export const transactionsAdapter = createEntityAdapter<Transaction>();

const initialState: TransactionsState = transactionsAdapter.getInitialState({
  loading: false,
  error: false,
});

export const transactionsReducer = createReducer(
  initialState,
  on(loadTransactions, (state) => ({ ...state, loading: true, error: false })),
  on(loadTransactionsSuccess, (state, { transactions }) =>
    transactionsAdapter.setAll(transactions, { ...state, loading: false, error: false }),
  ),
  on(loadTransactionsFailure, (state) => ({ ...state, loading: false, error: true })),
);
