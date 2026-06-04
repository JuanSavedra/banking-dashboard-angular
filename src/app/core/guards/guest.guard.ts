import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const isAuthenticated = store.selectSignal(selectIsAuthenticated);

  return isAuthenticated() ? router.createUrlTree(['/app/dashboard']) : true;
};
