import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../http/api-base-url.token';
import { unwrapData } from '../http/unwrap-data.operator';
import { ApiResponse, Card, UpdateCardPayload } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getCards(): Observable<Card[]> {
    return this.http.get<ApiResponse<Card[]>>(`${this.baseUrl}/cards`).pipe(unwrapData());
  }

  updateCard(id: string, payload: UpdateCardPayload): Observable<Card> {
    return this.http
      .put<ApiResponse<Card>>(`${this.baseUrl}/cards/${id}`, payload)
      .pipe(unwrapData());
  }
}
