import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse, Card, UpdateCardPayload } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private readonly http = inject(HttpClient);

  getCards(): Observable<Card[]> {
    return this.http.get<ApiResponse<Card[]>>('/api/cards').pipe(map((response) => response.data));
  }

  updateCard(id: string, payload: UpdateCardPayload): Observable<Card> {
    return this.http
      .put<ApiResponse<Card>>(`/api/cards/${id}`, payload)
      .pipe(map((response) => response.data));
  }
}
