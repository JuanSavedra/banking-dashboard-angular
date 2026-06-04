import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should authenticate valid e-mail credentials', () => {
    const authenticated = service.login({
      identifier: 'ana@banking.dev',
      password: '123456',
    });

    expect(authenticated).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('fake-token-fase-3');
  });

  it('should reject invalid credentials', () => {
    const authenticated = service.login({
      identifier: 'ana@banking.dev',
      password: 'senha-errada',
    });

    expect(authenticated).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear session on logout', () => {
    service.login({ identifier: '12345678909', password: '123456' });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
  });
});
