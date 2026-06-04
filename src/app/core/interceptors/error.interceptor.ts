import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

import { logout } from '../store/auth/auth.actions';

/**
 * Interceptor de erro global. Em respostas 401 encerra a sessão (dispara `logout`,
 * que limpa o storage e redireciona para o login). Demais erros são repassados
 * para os effects tratarem com seus `catchError` específicos.
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(Store);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        store.dispatch(logout());
      }

      return throwError(() => error);
    }),
  );
};
