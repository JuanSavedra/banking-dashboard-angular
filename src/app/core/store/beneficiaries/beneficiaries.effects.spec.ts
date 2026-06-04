import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Beneficiary } from '../../models/banking';
import { BeneficiariesService } from '../../services/beneficiaries';
import {
  createBeneficiary,
  createBeneficiaryFailure,
  createBeneficiarySuccess,
  loadBeneficiaries,
  loadBeneficiariesFailure,
  loadBeneficiariesSuccess,
} from './beneficiaries.actions';
import { BeneficiariesEffects } from './beneficiaries.effects';

const beneficiary: Beneficiary = {
  id: 'ben-marina',
  name: 'Marina Lopes',
  bank: 'Banco Verde',
  document: '123.456.789-09',
  pixKey: 'marina@email.dev',
  status: 'active',
  createdAt: '2026-05-12T13:30:00.000Z',
};

function setup(actions$: Observable<unknown>, service: Partial<BeneficiariesService>) {
  TestBed.configureTestingModule({
    providers: [
      BeneficiariesEffects,
      provideMockActions(() => actions$),
      { provide: BeneficiariesService, useValue: service },
    ],
  });

  return TestBed.inject(BeneficiariesEffects);
}

describe('BeneficiariesEffects', () => {
  it('emits loadBeneficiariesSuccess when the service resolves', () => {
    const effects = setup(of(loadBeneficiaries()), {
      getBeneficiaries: () => of([beneficiary]),
    });

    effects.loadBeneficiaries$.subscribe((action) => {
      expect(action).toEqual(loadBeneficiariesSuccess({ beneficiaries: [beneficiary] }));
    });
  });

  it('emits loadBeneficiariesFailure when the service throws', () => {
    const effects = setup(of(loadBeneficiaries()), {
      getBeneficiaries: () => throwError(() => new Error('network')),
    });

    effects.loadBeneficiaries$.subscribe((action) => {
      expect(action).toEqual(loadBeneficiariesFailure());
    });
  });

  it('emits createBeneficiarySuccess with the created entity', () => {
    const create = vi.fn(() => of(beneficiary));
    const effects = setup(
      of(
        createBeneficiary({
          payload: {
            name: beneficiary.name,
            bank: beneficiary.bank,
            document: beneficiary.document,
            pixKey: beneficiary.pixKey,
          },
        }),
      ),
      { createBeneficiary: create },
    );

    effects.createBeneficiary$.subscribe((action) => {
      expect(action).toEqual(createBeneficiarySuccess({ beneficiary }));
      expect(create).toHaveBeenCalledOnce();
    });
  });

  it('emits createBeneficiaryFailure when creation throws', () => {
    const effects = setup(
      of(
        createBeneficiary({
          payload: {
            name: beneficiary.name,
            bank: beneficiary.bank,
            document: beneficiary.document,
            pixKey: beneficiary.pixKey,
          },
        }),
      ),
      { createBeneficiary: () => throwError(() => new Error('fail')) },
    );

    effects.createBeneficiary$.subscribe((action) => {
      expect(action).toEqual(createBeneficiaryFailure());
    });
  });
});
