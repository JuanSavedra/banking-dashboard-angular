import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { AccountService } from '../../services/account';
import { loadAccount, loadAccountFailure, loadAccountSuccess } from './account.actions';

@Injectable()
export class AccountEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountService = inject(AccountService);

  loadAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAccount),
      switchMap(() =>
        this.accountService.getAccount().pipe(
          map((account) => loadAccountSuccess({ account })),
          catchError(() => of(loadAccountFailure())),
        ),
      ),
    ),
  );
}
