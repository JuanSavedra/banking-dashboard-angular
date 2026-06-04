import { createAction, props } from '@ngrx/store';

import { Card, UpdateCardPayload } from '../../models/banking';

export const loadCards = createAction('[Cards] Load Cards');

export const loadCardsSuccess = createAction(
  '[Cards] Load Cards Success',
  props<{ cards: Card[] }>(),
);

export const loadCardsFailure = createAction('[Cards] Load Cards Failure');

export const updateCard = createAction(
  '[Cards] Update Card',
  props<{ id: string; payload: UpdateCardPayload }>(),
);

export const updateCardSuccess = createAction(
  '[Cards] Update Card Success',
  props<{ card: Card }>(),
);

export const updateCardFailure = createAction('[Cards] Update Card Failure');
