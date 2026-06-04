import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthUser {
  name: string;
  identifier: string;
  accountLabel: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

const AUTH_STORAGE_KEY = 'banking-dashboard.auth';
const VALID_IDENTIFIERS = ['ana@banking.dev', '12345678909'];
const VALID_PASSWORD = '123456';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly sessionState = signal<AuthSession | null>(this.readSession());

  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);

  login(credentials: LoginCredentials): boolean {
    const identifier = this.normalizeIdentifier(credentials.identifier);
    const password = credentials.password.trim();

    if (!VALID_IDENTIFIERS.includes(identifier) || password !== VALID_PASSWORD) {
      return false;
    }

    const session: AuthSession = {
      token: 'fake-token-fase-3',
      user: {
        name: 'Ana Souza',
        identifier,
        accountLabel: 'Conta digital · Agência 0001',
      },
    };

    this.sessionState.set(session);
    this.persistSession(session);

    return true;
  }

  logout(): void {
    this.sessionState.set(null);

    if (this.isBrowser) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  getToken(): string | null {
    return this.sessionState()?.token ?? null;
  }

  private normalizeIdentifier(identifier: string): string {
    const trimmed = identifier.trim().toLowerCase();
    const digitsOnly = trimmed.replace(/\D/g, '');

    return digitsOnly.length === 11 ? digitsOnly : trimmed;
  }

  private persistSession(session: AuthSession): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  private readSession(): AuthSession | null {
    if (!this.isBrowser) {
      return null;
    }

    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      const parsedSession: unknown = JSON.parse(rawSession);

      return isAuthSession(parsedSession) ? parsedSession : null;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<AuthSession>;

  return (
    typeof session.token === 'string' &&
    typeof session.user?.name === 'string' &&
    typeof session.user.identifier === 'string' &&
    typeof session.user.accountLabel === 'string'
  );
}
