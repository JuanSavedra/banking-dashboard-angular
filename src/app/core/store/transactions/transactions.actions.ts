import { createAction, props } from '@ngrx/store';

import { Transaction } from '../../models/banking';

export const loadTransactions = createAction('[Transactions] Load Transactions');

export const loadTransactionsSuccess = createAction(
  '[Transactions] Load Transactions Success',
  props<{ transactions: Transaction[] }>(),
);

export const loadTransactionsFailure = createAction('[Transactions] Load Transactions Failure');
