import { createReducer, on } from '@ngrx/store';

import { Account } from '../../models/banking';
import { loadAccount, loadAccountFailure, loadAccountSuccess } from './account.actions';

export interface AccountState {
  account: Account | null;
  loading: boolean;
  error: boolean;
}

const initialState: AccountState = {
  account: null,
  loading: false,
  error: false,
};

export const accountReducer = createReducer(
  initialState,
  on(loadAccount, (state) => ({ ...state, loading: true, error: false })),
  on(loadAccountSuccess, (_state, { account }) => ({ account, loading: false, error: false })),
  on(loadAccountFailure, (state) => ({ ...state, loading: false, error: true })),
);
