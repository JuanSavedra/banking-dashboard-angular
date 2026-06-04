import { createReducer, on } from '@ngrx/store';

import { AuthSession } from '../../models/auth';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

export interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: boolean;
}

const initialState: AuthState = {
  session: null,
  loading: false,
  error: false,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, loading: true, error: false })),
  on(loginSuccess, (_state, { session }) => ({ session, loading: false, error: false })),
  on(loginFailure, (state) => ({ ...state, loading: false, error: true })),
  on(logout, () => initialState),
);
