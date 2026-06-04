import { Beneficiary } from '../../models/banking';
import {
  createBeneficiary,
  createBeneficiaryFailure,
  createBeneficiarySuccess,
  deleteBeneficiary,
  deleteBeneficiarySuccess,
  loadBeneficiaries,
  loadBeneficiariesSuccess,
  updateBeneficiary,
  updateBeneficiarySuccess,
} from './beneficiaries.actions';
import { beneficiariesReducer, BeneficiariesState } from './beneficiaries.reducer';
import {
  selectAllBeneficiaries,
  selectBeneficiariesSubmitting,
  selectBeneficiaryById,
} from './beneficiaries.selectors';

const marina: Beneficiary = {
  id: 'ben-marina',
  name: 'Marina Lopes',
  bank: 'Banco Verde',
  document: '123.456.789-09',
  pixKey: 'marina@email.dev',
  status: 'active',
  createdAt: '2026-05-12T13:30:00.000Z',
};

const ricardo: Beneficiary = {
  id: 'ben-ricardo',
  name: 'Ricardo Alves',
  bank: 'Banco Cinza',
  document: '987.654.321-00',
  pixKey: '+5511999990000',
  status: 'active',
  createdAt: '2026-05-20T16:15:00.000Z',
};

describe('beneficiariesReducer', () => {
  it('should load beneficiaries into entity state', () => {
    const loadingState = beneficiariesReducer(undefined, loadBeneficiaries());
    const state = beneficiariesReducer(
      loadingState,
      loadBeneficiariesSuccess({ beneficiaries: [marina, ricardo] }),
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
    expect(state.ids).toEqual(['ben-marina', 'ben-ricardo']);
  });

  it('should add, update and remove beneficiaries', () => {
    const stateWithItem = beneficiariesReducer(
      undefined,
      createBeneficiarySuccess({ beneficiary: marina }),
    );

    const updatedState = beneficiariesReducer(
      stateWithItem,
      updateBeneficiarySuccess({ beneficiary: { ...marina, status: 'pending' } }),
    );

    const finalState = beneficiariesReducer(
      updatedState,
      deleteBeneficiarySuccess({ id: marina.id }),
    );

    expect(updatedState.entities[marina.id]?.status).toBe('pending');
    expect(finalState.entities[marina.id]).toBeUndefined();
  });

  it('should control submitting state during mutations', () => {
    const creatingState = beneficiariesReducer(
      undefined,
      createBeneficiary({
        payload: {
          name: marina.name,
          bank: marina.bank,
          document: marina.document,
          pixKey: marina.pixKey,
        },
      }),
    );
    const failedState = beneficiariesReducer(creatingState, createBeneficiaryFailure());
    const updatingState = beneficiariesReducer(
      failedState,
      updateBeneficiary({ id: marina.id, payload: marina }),
    );
    const deletingState = beneficiariesReducer(updatingState, deleteBeneficiary({ id: marina.id }));

    expect(creatingState.submitting).toBe(true);
    expect(failedState.submitting).toBe(false);
    expect(updatingState.submitting).toBe(true);
    expect(deletingState.submitting).toBe(true);
  });
});

describe('beneficiaries selectors', () => {
  it('should select all beneficiaries, detail and submitting state', () => {
    const beneficiariesState = beneficiariesReducer(
      undefined,
      loadBeneficiariesSuccess({ beneficiaries: [marina, ricardo] }),
    );
    const state = {
      beneficiaries: { ...beneficiariesState, submitting: true } as BeneficiariesState,
    };

    expect(selectAllBeneficiaries(state)).toEqual([marina, ricardo]);
    expect(selectBeneficiaryById(marina.id)(state)).toEqual(marina);
    expect(selectBeneficiariesSubmitting(state)).toBe(true);
  });
});
