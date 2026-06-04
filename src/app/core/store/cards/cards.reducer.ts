import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Card } from '../../models/banking';
import {
  loadCards,
  loadCardsFailure,
  loadCardsSuccess,
  updateCard,
  updateCardFailure,
  updateCardSuccess,
} from './cards.actions';

export interface CardsState extends EntityState<Card> {
  loading: boolean;
  error: boolean;
}

export const cardsAdapter = createEntityAdapter<Card>();

const initialState: CardsState = cardsAdapter.getInitialState({
  loading: false,
  error: false,
});

export const cardsReducer = createReducer(
  initialState,
  on(loadCards, (state) => ({ ...state, loading: true, error: false })),
  on(loadCardsSuccess, (state, { cards }) =>
    cardsAdapter.setAll(cards, { ...state, loading: false, error: false }),
  ),
  on(loadCardsFailure, (state) => ({ ...state, loading: false, error: true })),
  on(updateCard, (state) => ({ ...state, error: false })),
  on(updateCardSuccess, (state, { card }) => cardsAdapter.upsertOne(card, state)),
  on(updateCardFailure, (state) => ({ ...state, error: true })),
);
