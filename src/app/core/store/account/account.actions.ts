import { createAction, props } from '@ngrx/store';

import { Account } from '../../models/banking';

export const loadAccount = createAction('[Account] Load Account');

export const loadAccountSuccess = createAction(
  '[Account] Load Account Success',
  props<{ account: Account }>(),
);

export const loadAccountFailure = createAction('[Account] Load Account Failure');
