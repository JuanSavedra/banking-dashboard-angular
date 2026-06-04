import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BeneficiaryStatusPipe } from './beneficiary-status.pipe';
import { CardStatusPipe } from './card-status.pipe';
import { CardTypePipe } from './card-type.pipe';
import { PurchaseStatusPipe } from './purchase-status.pipe';
import { SignedCurrencyPipe } from './signed-currency.pipe';
import { TransactionStatusPipe } from './transaction-status.pipe';

describe('status pipes', () => {
  it('maps transaction status to label and variant', () => {
    const pipe = new TransactionStatusPipe();

    expect(pipe.transform('completed')).toEqual({ label: 'Concluído', variant: 'success' });
    expect(pipe.transform('processing')).toEqual({ label: 'Processando', variant: 'info' });
    expect(pipe.transform('scheduled')).toEqual({ label: 'Agendado', variant: 'warning' });
  });

  it('maps beneficiary status', () => {
    const pipe = new BeneficiaryStatusPipe();

    expect(pipe.transform('active')).toEqual({ label: 'Ativo', variant: 'success' });
    expect(pipe.transform('pending')).toEqual({ label: 'Pendente', variant: 'warning' });
  });

  it('maps card status and type', () => {
    const statusPipe = new CardStatusPipe();
    const typePipe = new CardTypePipe();

    expect(statusPipe.transform('blocked')).toEqual({ label: 'Bloqueado', variant: 'warning' });
    expect(typePipe.transform('virtual')).toBe('Cartão virtual');
  });

  it('maps purchase status', () => {
    const pipe = new PurchaseStatusPipe();

    expect(pipe.transform('approved')).toEqual({ label: 'Aprovada', variant: 'success' });
    expect(pipe.transform('processing')).toEqual({ label: 'Processando', variant: 'info' });
  });
});

describe('SignedCurrencyPipe', () => {
  beforeAll(() => registerLocaleData(localePt));

  function createPipe(): SignedCurrencyPipe {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
      ],
    });

    return TestBed.runInInjectionContext(() => new SignedCurrencyPipe());
  }

  it('prefixes credits with + and debits with -', () => {
    const pipe = createPipe();

    expect(pipe.transform(1240, 'credit').startsWith('+')).toBe(true);
    expect(pipe.transform(1240, 'debit').startsWith('-')).toBe(true);
    expect(pipe.transform(1240, 'credit')).toContain('1.240,00');
  });
});
