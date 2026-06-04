import { createAction, props } from '@ngrx/store';

import { Beneficiary, CreateBeneficiaryPayload } from '../../models/banking';

export const loadBeneficiaries = createAction('[Beneficiaries] Load Beneficiaries');

export const loadBeneficiariesSuccess = createAction(
  '[Beneficiaries] Load Beneficiaries Success',
  props<{ beneficiaries: Beneficiary[] }>(),
);

export const loadBeneficiariesFailure = createAction('[Beneficiaries] Load Beneficiaries Failure');

export const createBeneficiary = createAction(
  '[Beneficiaries] Create Beneficiary',
  props<{ payload: CreateBeneficiaryPayload }>(),
);

export const createBeneficiarySuccess = createAction(
  '[Beneficiaries] Create Beneficiary Success',
  props<{ beneficiary: Beneficiary }>(),
);

export const createBeneficiaryFailure = createAction('[Beneficiaries] Create Beneficiary Failure');
