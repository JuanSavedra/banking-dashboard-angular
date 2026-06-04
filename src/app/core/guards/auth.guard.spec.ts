import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';

import { AuthService } from '../services/auth';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';

describe('route guards', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect unauthenticated users to login with returnUrl', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard(new ActivatedRouteSnapshot(), { url: '/app/cards' } as RouterStateSnapshot),
    );

    expect(router.serializeUrl(result as ReturnType<typeof router.createUrlTree>)).toBe(
      '/login?returnUrl=%2Fapp%2Fcards',
    );
  });

  it('should allow authenticated users into private routes', () => {
    authService.login({ identifier: 'ana@banking.dev', password: '123456' });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(new ActivatedRouteSnapshot(), { url: '/app/dashboard' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('should redirect authenticated guests away from login', () => {
    authService.login({ identifier: '12345678909', password: '123456' });

    const result = TestBed.runInInjectionContext(() =>
      guestGuard(new ActivatedRouteSnapshot(), { url: '/login' } as RouterStateSnapshot),
    );

    expect(router.serializeUrl(result as ReturnType<typeof router.createUrlTree>)).toBe(
      '/app/dashboard',
    );
  });
});
