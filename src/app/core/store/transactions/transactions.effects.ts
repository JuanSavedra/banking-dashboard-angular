import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { TransactionsService } from '../../services/transactions';
import {
  loadTransactions,
  loadTransactionsFailure,
  loadTransactionsSuccess,
} from './transactions.actions';

@Injectable()
export class TransactionsEffects {
  private readonly actions$ = inject(Actions);
  private readonly transactionsService = inject(TransactionsService);

  loadTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTransactions),
      switchMap(() =>
        this.transactionsService.getTransactions().pipe(
          map((transactions) => loadTransactionsSuccess({ transactions })),
          catchError(() => of(loadTransactionsFailure())),
        ),
      ),
    ),
  );
}
