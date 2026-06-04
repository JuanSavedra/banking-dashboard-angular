import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectSession = createSelector(selectAuthState, (state) => state.session);

export const selectUser = createSelector(selectSession, (session) => session?.user ?? null);

export const selectIsAuthenticated = createSelector(selectSession, (session) => session !== null);

export const selectToken = createSelector(selectSession, (session) => session?.token ?? null);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
