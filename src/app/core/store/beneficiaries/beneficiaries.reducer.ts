import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Beneficiary } from '../../models/banking';
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

export interface BeneficiariesState extends EntityState<Beneficiary> {
  loading: boolean;
  error: boolean;
  submitting: boolean;
}

export const beneficiariesAdapter = createEntityAdapter<Beneficiary>();

const initialState: BeneficiariesState = beneficiariesAdapter.getInitialState({
  loading: false,
  error: false,
  submitting: false,
});

export const beneficiariesReducer = createReducer(
  initialState,
  on(loadBeneficiaries, (state) => ({ ...state, loading: true, error: false })),
  on(loadBeneficiariesSuccess, (state, { beneficiaries }) =>
    beneficiariesAdapter.setAll(beneficiaries, { ...state, loading: false, error: false }),
  ),
  on(loadBeneficiariesFailure, (state) => ({ ...state, loading: false, error: true })),
  on(createBeneficiary, (state) => ({ ...state, submitting: true, error: false })),
  on(createBeneficiarySuccess, (state, { beneficiary }) =>
    beneficiariesAdapter.addOne(beneficiary, { ...state, submitting: false }),
  ),
  on(createBeneficiaryFailure, (state) => ({ ...state, submitting: false, error: true })),
  on(updateBeneficiary, (state) => ({ ...state, submitting: true, error: false })),
  on(updateBeneficiarySuccess, (state, { beneficiary }) =>
    beneficiariesAdapter.upsertOne(beneficiary, { ...state, submitting: false }),
  ),
  on(updateBeneficiaryFailure, (state) => ({ ...state, submitting: false, error: true })),
  on(deleteBeneficiary, (state) => ({ ...state, submitting: true, error: false })),
  on(deleteBeneficiarySuccess, (state, { id }) =>
    beneficiariesAdapter.removeOne(id, { ...state, submitting: false }),
  ),
  on(deleteBeneficiaryFailure, (state) => ({ ...state, submitting: false, error: true })),
);
