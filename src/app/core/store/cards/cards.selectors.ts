import { createFeatureSelector, createSelector } from '@ngrx/store';

import { cardsAdapter, CardsState } from './cards.reducer';

export const selectCardsState = createFeatureSelector<CardsState>('cards');

const { selectAll } = cardsAdapter.getSelectors();

export const selectAllCards = createSelector(selectCardsState, selectAll);

export const selectCardsLoading = createSelector(selectCardsState, (state) => state.loading);

export const selectCardsError = createSelector(selectCardsState, (state) => state.error);

export const selectCardsSubmitting = createSelector(selectCardsState, (state) => state.submitting);
