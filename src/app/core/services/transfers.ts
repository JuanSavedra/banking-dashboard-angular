import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../http/api-base-url.token';
import { unwrapData } from '../http/unwrap-data.operator';
import { ApiResponse, CreateTransferPayload, Transfer } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class TransfersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  createTransfer(payload: CreateTransferPayload): Observable<Transfer> {
    return this.http
      .post<ApiResponse<Transfer>>(`${this.baseUrl}/transfers`, payload)
      .pipe(unwrapData());
  }
}
