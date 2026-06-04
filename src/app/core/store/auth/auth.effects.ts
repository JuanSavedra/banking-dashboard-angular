import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { INIT } from '@ngrx/store';
import { map, tap } from 'rxjs';

import { AuthSession, isAuthSession, LoginCredentials } from '../../models/auth';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

const AUTH_STORAGE_KEY = 'banking-dashboard.auth';
const VALID_IDENTIFIERS = ['ana@banking.dev', '12345678909'];
const VALID_PASSWORD = '123456';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(INIT),
      map(() => {
        const session = this.readSession();
        return session ? loginSuccess({ session }) : logout();
      }),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      map(({ credentials, returnUrl }) => {
        const session = this.validateCredentials(credentials);
        return session ? loginSuccess({ session, returnUrl }) : loginFailure();
      }),
    ),
  );

  persistSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ session, returnUrl }) => {
          this.saveSession(session);
          void this.router.navigateByUrl(returnUrl ?? '/app/dashboard');
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.clearSession();
          void this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );

  private validateCredentials(credentials: LoginCredentials): AuthSession | null {
    const identifier = this.normalizeIdentifier(credentials.identifier);
    const password = credentials.password.trim();

    if (!VALID_IDENTIFIERS.includes(identifier) || password !== VALID_PASSWORD) {
      return null;
    }

    return {
      token: 'banking-token-fase-5',
      user: {
        name: 'Ana Souza',
        identifier,
        accountLabel: 'Conta digital · Agência 0001',
      },
    };
  }

  private normalizeIdentifier(identifier: string): string {
    const trimmed = identifier.trim().toLowerCase();
    const digitsOnly = trimmed.replace(/\D/g, '');
    return digitsOnly.length === 11 ? digitsOnly : trimmed;
  }

  private readSession(): AuthSession | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return isAuthSession(parsed) ? parsed : null;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }

  private saveSession(session: AuthSession): void {
    if (this.isBrowser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }
  }

  private clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
}
