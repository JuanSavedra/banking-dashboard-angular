import { Card } from '../../models/banking';
import {
  loadCards,
  loadCardsFailure,
  loadCardsSuccess,
  updateCard,
  updateCardFailure,
  updateCardSuccess,
} from './cards.actions';
import { cardsReducer, CardsState } from './cards.reducer';
import { selectAllCards, selectCardsSubmitting } from './cards.selectors';

const card: Card = {
  id: 'card-4482',
  holderName: 'Ana Souza',
  finalDigits: '4482',
  type: 'physical',
  status: 'active',
  limit: 6500,
  availableLimit: 4800,
  dueDay: 10,
  recentPurchases: [
    {
      id: 'pur-001',
      description: 'Mercado',
      merchant: 'Mercado Central',
      amount: 241.35,
      status: 'approved',
      occurredAt: '2026-06-02T21:10:00.000Z',
    },
  ],
};

describe('cardsReducer', () => {
  it('should load cards into entity state', () => {
    const loadingState = cardsReducer(undefined, loadCards());
    const state = cardsReducer(loadingState, loadCardsSuccess({ cards: [card] }));

    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
    expect(state.ids).toEqual(['card-4482']);
  });

  it('should mark load failures', () => {
    const state = cardsReducer(undefined, loadCardsFailure());

    expect(state.loading).toBe(false);
    expect(state.error).toBe(true);
  });

  it('should update cards and control submitting state', () => {
    const loadedState = cardsReducer(undefined, loadCardsSuccess({ cards: [card] }));
    const submittingState = cardsReducer(
      loadedState,
      updateCard({ id: card.id, payload: { availableLimit: 3200 } }),
    );
    const successState = cardsReducer(
      submittingState,
      updateCardSuccess({ card: { ...card, availableLimit: 3200 } }),
    );
    const failureState = cardsReducer(submittingState, updateCardFailure());

    expect(submittingState.submitting).toBe(true);
    expect(successState.submitting).toBe(false);
    expect(successState.entities[card.id]?.availableLimit).toBe(3200);
    expect(failureState.submitting).toBe(false);
    expect(failureState.error).toBe(true);
  });
});

describe('cards selectors', () => {
  it('should select cards and submitting state', () => {
    const cardsState = cardsReducer(undefined, loadCardsSuccess({ cards: [card] }));
    const state = { cards: { ...cardsState, submitting: true } as CardsState };

    expect(selectAllCards(state)).toEqual([card]);
    expect(selectCardsSubmitting(state)).toBe(true);
  });
});
