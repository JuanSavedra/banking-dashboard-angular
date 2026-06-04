import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../http/api-base-url.token';
import { unwrapData } from '../http/unwrap-data.operator';
import { ApiResponse, Transaction } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getTransactions(): Observable<Transaction[]> {
    return this.http
      .get<ApiResponse<Transaction[]>>(`${this.baseUrl}/transactions`)
      .pipe(unwrapData());
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http
      .get<ApiResponse<Transaction>>(`${this.baseUrl}/transactions/${id}`)
      .pipe(unwrapData());
  }
}
