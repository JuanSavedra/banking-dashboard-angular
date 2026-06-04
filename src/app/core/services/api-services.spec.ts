import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Account, Beneficiary, Card, Transaction, Transfer } from '../models/banking';
import { AccountService } from './account';
import { BeneficiariesService } from './beneficiaries';
import { CardsService } from './cards';
import { TransactionsService } from './transactions';
import { TransfersService } from './transfers';

describe('API services', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load account data', () => {
    const service = TestBed.inject(AccountService);
    const account: Account = {
      id: 'acc-ana',
      holderName: 'Ana Souza',
      branch: '0001',
      number: '45892-1',
      balance: 8420.9,
      currency: 'BRL',
      incomeThisMonth: 12840,
      outcomeThisMonth: 4219.3,
    };

    service.getAccount().subscribe((result) => {
      expect(result).toEqual(account);
    });

    const request = httpTesting.expectOne('/api/account');
    expect(request.request.method).toBe('GET');
    request.flush({ data: account });
  });

  it('should load transactions and a transaction detail', () => {
    const service = TestBed.inject(TransactionsService);
    const transaction: Transaction = {
      id: 'txn-001',
      description: 'Pix recebido',
      counterparty: 'Marina Lopes',
      amount: 1240,
      type: 'credit',
      status: 'completed',
      category: 'Pix',
      occurredAt: '2026-06-04T12:42:00.000Z',
    };

    service.getTransactions().subscribe((result) => {
      expect(result).toEqual([transaction]);
    });

    httpTesting.expectOne('/api/transactions').flush({ data: [transaction] });

    service.getTransaction(transaction.id).subscribe((result) => {
      expect(result).toEqual(transaction);
    });

    const request = httpTesting.expectOne('/api/transactions/txn-001');
    expect(request.request.method).toBe('GET');
    request.flush({ data: transaction });
  });

  it('should create, update and delete beneficiaries', () => {
    const service = TestBed.inject(BeneficiariesService);
    const beneficiary: Beneficiary = {
      id: 'ben-marina',
      name: 'Marina Lopes',
      bank: 'Banco Verde',
      document: '123.456.789-09',
      pixKey: 'marina@email.dev',
      status: 'active',
      createdAt: '2026-05-12T13:30:00.000Z',
    };

    service
      .createBeneficiary({
        name: beneficiary.name,
        bank: beneficiary.bank,
        document: beneficiary.document,
        pixKey: beneficiary.pixKey,
      })
      .subscribe((result) => {
        expect(result).toEqual(beneficiary);
      });

    const createRequest = httpTesting.expectOne('/api/beneficiaries');
    expect(createRequest.request.method).toBe('POST');
    createRequest.flush({ data: beneficiary });

    service.updateBeneficiary(beneficiary.id, { status: 'pending' }).subscribe((result) => {
      expect(result.status).toBe('pending');
    });

    const updateRequest = httpTesting.expectOne('/api/beneficiaries/ben-marina');
    expect(updateRequest.request.method).toBe('PUT');
    updateRequest.flush({ data: { ...beneficiary, status: 'pending' } });

    service.deleteBeneficiary(beneficiary.id).subscribe((result) => {
      expect(result).toEqual({ id: beneficiary.id });
    });

    const deleteRequest = httpTesting.expectOne('/api/beneficiaries/ben-marina');
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush({ data: { id: beneficiary.id } });
  });

  it('should create transfers', () => {
    const service = TestBed.inject(TransfersService);
    const transfer: Transfer = {
      id: 'trf-001',
      beneficiaryId: 'ben-marina',
      amount: 120,
      description: 'Reserva',
      status: 'completed',
      receiptCode: 'BD-001',
      createdAt: '2026-06-04T15:00:00.000Z',
    };

    service
      .createTransfer({
        beneficiaryId: transfer.beneficiaryId,
        amount: transfer.amount,
        description: transfer.description,
      })
      .subscribe((result) => {
        expect(result).toEqual(transfer);
      });

    const request = httpTesting.expectOne('/api/transfers');
    expect(request.request.method).toBe('POST');
    request.flush({ data: transfer });
  });

  it('should load and update cards', () => {
    const service = TestBed.inject(CardsService);
    const card: Card = {
      id: 'card-4482',
      holderName: 'Ana Souza',
      finalDigits: '4482',
      type: 'physical',
      status: 'active',
      limit: 6500,
      availableLimit: 4800,
      dueDay: 10,
      recentPurchases: [
        {
          id: 'pur-001',
          description: 'Mercado',
          merchant: 'Mercado Central',
          amount: 241.35,
          status: 'approved',
          occurredAt: '2026-06-02T21:10:00.000Z',
        },
      ],
    };

    service.getCards().subscribe((result) => {
      expect(result).toEqual([card]);
      expect(result[0].recentPurchases.length).toBe(1);
    });

    httpTesting.expectOne('/api/cards').flush({ data: [card] });

    service.updateCard(card.id, { status: 'blocked' }).subscribe((result) => {
      expect(result.status).toBe('blocked');
    });

    const request = httpTesting.expectOne('/api/cards/card-4482');
    expect(request.request.method).toBe('PUT');
    request.flush({ data: { ...card, status: 'blocked' } });
  });
});
