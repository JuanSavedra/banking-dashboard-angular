import { createReducer, on } from '@ngrx/store';

import { Transfer } from '../../models/banking';
import {
  clearReceipt,
  createTransfer,
  createTransferFailure,
  createTransferSuccess,
} from './transfers.actions';

export interface TransfersState {
  receipt: Transfer | null;
  submitting: boolean;
  error: boolean;
}

const initialState: TransfersState = {
  receipt: null,
  submitting: false,
  error: false,
};

export const transfersReducer = createReducer(
  initialState,
  on(createTransfer, (state) => ({ ...state, submitting: true, error: false })),
  on(createTransferSuccess, (_state, { transfer }) => ({
    receipt: transfer,
    submitting: false,
    error: false,
  })),
  on(createTransferFailure, (state) => ({ ...state, submitting: false, error: true })),
  on(clearReceipt, (state) => ({ ...state, receipt: null })),
);
