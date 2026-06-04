import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse, CreateTransferPayload, Transfer } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class TransfersService {
  private readonly http = inject(HttpClient);

  createTransfer(payload: CreateTransferPayload): Observable<Transfer> {
    return this.http
      .post<ApiResponse<Transfer>>('/api/transfers', payload)
      .pipe(map((response) => response.data));
  }
}
