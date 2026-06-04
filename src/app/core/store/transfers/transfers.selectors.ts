import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TransfersState } from './transfers.reducer';

export const selectTransfersState = createFeatureSelector<TransfersState>('transfers');

export const selectTransferReceipt = createSelector(selectTransfersState, (state) => state.receipt);

export const selectTransferSubmitting = createSelector(
  selectTransfersState,
  (state) => state.submitting,
);

export const selectTransferError = createSelector(selectTransfersState, (state) => state.error);
