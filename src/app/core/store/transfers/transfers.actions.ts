import { createAction, props } from '@ngrx/store';

import { CreateTransferPayload, Transfer } from '../../models/banking';

export const createTransfer = createAction(
  '[Transfers] Create Transfer',
  props<{ payload: CreateTransferPayload }>(),
);

export const createTransferSuccess = createAction(
  '[Transfers] Create Transfer Success',
  props<{ transfer: Transfer }>(),
);

export const createTransferFailure = createAction('[Transfers] Create Transfer Failure');

export const clearReceipt = createAction('[Transfers] Clear Receipt');
