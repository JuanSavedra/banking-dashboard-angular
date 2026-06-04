import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  ApiResponse,
  Beneficiary,
  CreateBeneficiaryPayload,
  UpdateBeneficiaryPayload,
} from '../models/banking';

@Injectable({ providedIn: 'root' })
export class BeneficiariesService {
  private readonly http = inject(HttpClient);

  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.http
      .get<ApiResponse<Beneficiary[]>>('/api/beneficiaries')
      .pipe(map((response) => response.data));
  }

  getBeneficiary(id: string): Observable<Beneficiary> {
    return this.http
      .get<ApiResponse<Beneficiary>>(`/api/beneficiaries/${id}`)
      .pipe(map((response) => response.data));
  }

  createBeneficiary(payload: CreateBeneficiaryPayload): Observable<Beneficiary> {
    return this.http
      .post<ApiResponse<Beneficiary>>('/api/beneficiaries', payload)
      .pipe(map((response) => response.data));
  }

  updateBeneficiary(id: string, payload: UpdateBeneficiaryPayload): Observable<Beneficiary> {
    return this.http
      .put<ApiResponse<Beneficiary>>(`/api/beneficiaries/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  deleteBeneficiary(id: string): Observable<{ id: string }> {
    return this.http
      .delete<ApiResponse<{ id: string }>>(`/api/beneficiaries/${id}`)
      .pipe(map((response) => response.data));
  }
}
