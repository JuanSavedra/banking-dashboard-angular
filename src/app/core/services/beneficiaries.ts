import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../http/api-base-url.token';
import { unwrapData } from '../http/unwrap-data.operator';
import {
  ApiResponse,
  Beneficiary,
  CreateBeneficiaryPayload,
  UpdateBeneficiaryPayload,
} from '../models/banking';

@Injectable({ providedIn: 'root' })
export class BeneficiariesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.http
      .get<ApiResponse<Beneficiary[]>>(`${this.baseUrl}/beneficiaries`)
      .pipe(unwrapData());
  }

  getBeneficiary(id: string): Observable<Beneficiary> {
    return this.http
      .get<ApiResponse<Beneficiary>>(`${this.baseUrl}/beneficiaries/${id}`)
      .pipe(unwrapData());
  }

  createBeneficiary(payload: CreateBeneficiaryPayload): Observable<Beneficiary> {
    return this.http
      .post<ApiResponse<Beneficiary>>(`${this.baseUrl}/beneficiaries`, payload)
      .pipe(unwrapData());
  }

  updateBeneficiary(id: string, payload: UpdateBeneficiaryPayload): Observable<Beneficiary> {
    return this.http
      .put<ApiResponse<Beneficiary>>(`${this.baseUrl}/beneficiaries/${id}`, payload)
      .pipe(unwrapData());
  }

  deleteBeneficiary(id: string): Observable<{ id: string }> {
    return this.http
      .delete<ApiResponse<{ id: string }>>(`${this.baseUrl}/beneficiaries/${id}`)
      .pipe(unwrapData());
  }
}
