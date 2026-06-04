import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { CardsService } from '../../services/cards';
import {
  loadCards,
  loadCardsFailure,
  loadCardsSuccess,
  updateCard,
  updateCardFailure,
  updateCardSuccess,
} from './cards.actions';

@Injectable()
export class CardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly cardsService = inject(CardsService);

  loadCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCards),
      switchMap(() =>
        this.cardsService.getCards().pipe(
          map((cards) => loadCardsSuccess({ cards })),
          catchError(() => of(loadCardsFailure())),
        ),
      ),
    ),
  );

  updateCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCard),
      switchMap(({ id, payload }) =>
        this.cardsService.updateCard(id, payload).pipe(
          map((card) => updateCardSuccess({ card })),
          catchError(() => of(updateCardFailure())),
        ),
      ),
    ),
  );
}
