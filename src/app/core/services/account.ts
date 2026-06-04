import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Account, ApiResponse } from '../models/banking';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  getAccount(): Observable<Account> {
    return this.http
      .get<ApiResponse<Account>>('/api/account')
      .pipe(map((response) => response.data));
  }
}
