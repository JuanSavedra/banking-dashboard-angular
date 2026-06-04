import { loginFailure, loginSuccess, logout, login } from '../store/auth/auth.actions';
import { authReducer, AuthState } from '../store/auth/auth.reducer';
import {
  selectIsAuthenticated,
  selectToken,
  selectUser,
  selectAuthError,
} from '../store/auth/auth.selectors';
import { createSelector } from '@ngrx/store';

const initialState: AuthState = { session: null, loading: false, error: false };

const session = {
  token: 'test-token',
  user: { name: 'Ana Souza', identifier: 'ana@banking.dev', accountLabel: 'Conta digital' },
};

describe('Auth Reducer', () => {
  it('should set loading on login', () => {
    const state = authReducer(
      initialState,
      login({ credentials: { identifier: 'ana@banking.dev', password: '123456' } }),
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
  });

  it('should store session on loginSuccess', () => {
    const state = authReducer(initialState, loginSuccess({ session }));

    expect(state.session).toEqual(session);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
  });

  it('should set error on loginFailure', () => {
    const state = authReducer(initialState, loginFailure());

    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(true);
  });

  it('should clear state on logout', () => {
    const authenticatedState = authReducer(initialState, loginSuccess({ session }));
    const state = authReducer(authenticatedState, logout());

    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
  });
});

describe('Auth Selectors', () => {
  const state = { auth: { session, loading: false, error: false } };
  const emptyState = { auth: initialState };

  it('should select isAuthenticated true when session exists', () => {
    expect(selectIsAuthenticated.projector(session)).toBe(true);
  });

  it('should select isAuthenticated false when no session', () => {
    expect(selectIsAuthenticated.projector(null)).toBe(false);
  });

  it('should select token from session', () => {
    expect(selectToken.projector(session)).toBe('test-token');
  });

  it('should select null token when no session', () => {
    expect(selectToken.projector(null)).toBeNull();
  });

  it('should select user from session', () => {
    expect(selectUser.projector(session)).toEqual(session.user);
  });
});
