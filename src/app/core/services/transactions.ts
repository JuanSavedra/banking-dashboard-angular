import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse, Transaction } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    return this.http
      .get<ApiResponse<Transaction[]>>('/api/transactions')
      .pipe(map((response) => response.data));
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.http
      .get<ApiResponse<Transaction>>(`/api/transactions/${id}`)
      .pipe(map((response) => response.data));
  }
}
