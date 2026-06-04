import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { BeneficiariesService } from '../../services/beneficiaries';
import {
  createBeneficiary,
  createBeneficiaryFailure,
  createBeneficiarySuccess,
  deleteBeneficiary,
  deleteBeneficiaryFailure,
  deleteBeneficiarySuccess,
  loadBeneficiaries,
  loadBeneficiariesFailure,
  loadBeneficiariesSuccess,
  updateBeneficiary,
  updateBeneficiaryFailure,
  updateBeneficiarySuccess,
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

  updateBeneficiary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBeneficiary),
      switchMap(({ id, payload }) =>
        this.beneficiariesService.updateBeneficiary(id, payload).pipe(
          map((beneficiary) => updateBeneficiarySuccess({ beneficiary })),
          catchError(() => of(updateBeneficiaryFailure())),
        ),
      ),
    ),
  );

  deleteBeneficiary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBeneficiary),
      switchMap(({ id }) =>
        this.beneficiariesService.deleteBeneficiary(id).pipe(
          map((result) => deleteBeneficiarySuccess({ id: result.id })),
          catchError(() => of(deleteBeneficiaryFailure())),
        ),
      ),
    ),
  );
}
