import { createFeatureSelector, createSelector } from '@ngrx/store';

import { beneficiariesAdapter, BeneficiariesState } from './beneficiaries.reducer';

export const selectBeneficiariesState = createFeatureSelector<BeneficiariesState>('beneficiaries');

const { selectAll, selectEntities } = beneficiariesAdapter.getSelectors();

export const selectAllBeneficiaries = createSelector(selectBeneficiariesState, selectAll);

export const selectBeneficiaryEntities = createSelector(selectBeneficiariesState, selectEntities);

export const selectBeneficiaryById = (id: string) =>
  createSelector(selectBeneficiaryEntities, (entities) => entities[id] ?? null);

export const selectBeneficiariesLoading = createSelector(
  selectBeneficiariesState,
  (state) => state.loading,
);

export const selectBeneficiariesError = createSelector(
  selectBeneficiariesState,
  (state) => state.error,
);

export const selectBeneficiariesSubmitting = createSelector(
  selectBeneficiariesState,
  (state) => state.submitting,
);
