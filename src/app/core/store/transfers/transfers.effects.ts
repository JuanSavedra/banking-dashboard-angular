import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { TransfersService } from '../../services/transfers';
import { createTransfer, createTransferFailure, createTransferSuccess } from './transfers.actions';

@Injectable()
export class TransfersEffects {
  private readonly actions$ = inject(Actions);
  private readonly transfersService = inject(TransfersService);

  createTransfer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTransfer),
      switchMap(({ payload }) =>
        this.transfersService.createTransfer(payload).pipe(
          map((transfer) => createTransferSuccess({ transfer })),
          catchError(() => of(createTransferFailure())),
        ),
      ),
    ),
  );
}
