import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { selectIsAuthenticated } from '../store/auth/auth.selectors';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';

describe('route guards', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: { auth: { session: null, loading: false, error: false } },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should redirect unauthenticated users to login with returnUrl', () => {
    store.overrideSelector(selectIsAuthenticated, false);
    store.refreshState();

    const result = TestBed.runInInjectionContext(() =>
      authGuard(new ActivatedRouteSnapshot(), { url: '/app/cards' } as RouterStateSnapshot),
    );

    expect(router.serializeUrl(result as ReturnType<typeof router.createUrlTree>)).toBe(
      '/login?returnUrl=%2Fapp%2Fcards',
    );
  });

  it('should allow authenticated users into private routes', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.refreshState();

    const result = TestBed.runInInjectionContext(() =>
      authGuard(new ActivatedRouteSnapshot(), { url: '/app/dashboard' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('should redirect authenticated guests away from login', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.refreshState();

    const result = TestBed.runInInjectionContext(() =>
      guestGuard(new ActivatedRouteSnapshot(), { url: '/login' } as RouterStateSnapshot),
    );

    expect(router.serializeUrl(result as ReturnType<typeof router.createUrlTree>)).toBe(
      '/app/dashboard',
    );
  });

  it('should allow unauthenticated users to access guest routes', () => {
    store.overrideSelector(selectIsAuthenticated, false);
    store.refreshState();

    const result = TestBed.runInInjectionContext(() =>
      guestGuard(new ActivatedRouteSnapshot(), { url: '/login' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });
});
