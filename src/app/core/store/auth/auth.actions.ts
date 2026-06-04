import { createAction, props } from '@ngrx/store';

import { AuthSession, LoginCredentials } from '../../models/auth';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials; returnUrl?: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ session: AuthSession; returnUrl?: string }>(),
);

export const loginFailure = createAction('[Auth] Login Failure');

export const logout = createAction('[Auth] Logout');
