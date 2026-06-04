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

export function isAuthSession(value: unknown): value is AuthSession {
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
