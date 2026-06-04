import { createAction, props } from '@ngrx/store';

import {
  Beneficiary,
  CreateBeneficiaryPayload,
  UpdateBeneficiaryPayload,
} from '../../models/banking';

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

export const updateBeneficiary = createAction(
  '[Beneficiaries] Update Beneficiary',
  props<{ id: string; payload: UpdateBeneficiaryPayload }>(),
);

export const updateBeneficiarySuccess = createAction(
  '[Beneficiaries] Update Beneficiary Success',
  props<{ beneficiary: Beneficiary }>(),
);

export const updateBeneficiaryFailure = createAction('[Beneficiaries] Update Beneficiary Failure');

export const deleteBeneficiary = createAction(
  '[Beneficiaries] Delete Beneficiary',
  props<{ id: string }>(),
);

export const deleteBeneficiarySuccess = createAction(
  '[Beneficiaries] Delete Beneficiary Success',
  props<{ id: string }>(),
);

export const deleteBeneficiaryFailure = createAction('[Beneficiaries] Delete Beneficiary Failure');
