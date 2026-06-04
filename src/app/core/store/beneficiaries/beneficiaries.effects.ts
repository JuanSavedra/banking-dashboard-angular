import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { BeneficiariesService } from '../../services/beneficiaries';
import {
  createBeneficiary,
  createBeneficiaryFailure,
  createBeneficiarySuccess,
  loadBeneficiaries,
  loadBeneficiariesFailure,
  loadBeneficiariesSuccess,
} from './beneficiaries.actions';

@Injectable()
export class BeneficiariesEffects {
  private readonly actions$ = inject(Actions);
  private readonly beneficiariesService = inject(BeneficiariesService);

  loadBeneficiaries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBeneficiaries),
      switchMap(() =>
        this.beneficiariesService.getBeneficiaries().pipe(
          map((beneficiaries) => loadBeneficiariesSuccess({ beneficiaries })),
          catchError(() => of(loadBeneficiariesFailure())),
        ),
      ),
    ),
  );

  createBeneficiary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBeneficiary),
      switchMap(({ payload }) =>
        this.beneficiariesService.createBeneficiary(payload).pipe(
          map((beneficiary) => createBeneficiarySuccess({ beneficiary })),
          catchError(() => of(createBeneficiaryFailure())),
        ),
      ),
    ),
  );
}
