import { CurrencyPipe } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { TransactionType } from '../../core/models/banking';

/**
 * Formata um valor monetário com sinal (+/-) conforme o tipo de movimentação,
 * reaproveitando o `CurrencyPipe` nativo (locale pt-BR / BRL).
 */
@Pipe({ name: 'signedCurrency', standalone: true })
export class SignedCurrencyPipe implements PipeTransform {
  private readonly currencyPipe = new CurrencyPipe(
    inject(LOCALE_ID),
    inject(DEFAULT_CURRENCY_CODE),
  );

  transform(amount: number, type: TransactionType): string {
    const prefix = type === 'credit' ? '+' : '-';
    return `${prefix} ${this.currencyPipe.transform(amount) ?? ''}`;
  }
}
