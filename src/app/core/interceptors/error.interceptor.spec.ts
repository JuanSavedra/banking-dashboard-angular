import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';

import { logout } from '../store/auth/auth.actions';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  const dispatch = vi.fn();

  beforeEach(() => {
    dispatch.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Store, useValue: { dispatch } },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('dispatches logout on 401 and rethrows the error', () => {
    let status: number | undefined;
    http.get('/api/account').subscribe({ error: (err) => (status = err.status) });

    httpTesting.expectOne('/api/account').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(dispatch).toHaveBeenCalledWith(logout());
    expect(status).toBe(401);
  });

  it('does not dispatch logout for non-401 errors', () => {
    let status: number | undefined;
    http.get('/api/account').subscribe({ error: (err) => (status = err.status) });

    httpTesting.expectOne('/api/account').flush(null, { status: 500, statusText: 'Server Error' });

    expect(dispatch).not.toHaveBeenCalled();
    expect(status).toBe(500);
  });
});
