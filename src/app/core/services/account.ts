import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../http/api-base-url.token';
import { unwrapData } from '../http/unwrap-data.operator';
import { Account, ApiResponse } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAccount(): Observable<Account> {
    return this.http.get<ApiResponse<Account>>(`${this.baseUrl}/account`).pipe(unwrapData());
  }
}
