import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { onlyDigits } from '../utils/masks';

export type PixKeyType = 'celular' | 'cpf' | 'cnpj' | 'email' | 'aleatoria';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RANDOM_KEY_RE = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/** Valida um CPF pelos dígitos verificadores. */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digit = (length: number): number => {
    let total = 0;
    for (let i = 0; i < length; i++) total += Number(cpf[i]) * (length + 1 - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

/** Valida um CNPJ pelos dígitos verificadores. */
export function isValidCnpj(value: string): boolean {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const digit = (length: number): number => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let total = 0;
    for (let i = 0; i < length; i++) total += Number(cnpj[i]) * weights[i];
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return digit(12) === Number(cnpj[12]) && digit(13) === Number(cnpj[13]);
}

/** Validator de documento: aceita CPF (11) ou CNPJ (14) válidos. */
export const cpfOrCnpjValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = (control.value as string) ?? '';
  if (!value) return null;

  const digits = onlyDigits(value);
  const valid = digits.length > 11 ? isValidCnpj(digits) : isValidCpf(digits);
  return valid ? null : { document: true };
};

/** Validator de chave Pix conforme o tipo selecionado. */
export function pixKeyValidator(type: PixKeyType): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = ((control.value as string) ?? '').trim();
    if (!value) return null;

    const digits = onlyDigits(value);
    let valid = false;

    switch (type) {
      case 'celular':
        valid = digits.length === 10 || digits.length === 11;
        break;
      case 'cpf':
        valid = isValidCpf(digits);
        break;
      case 'cnpj':
        valid = isValidCnpj(digits);
        break;
      case 'email':
        valid = EMAIL_RE.test(value);
        break;
      case 'aleatoria':
        valid = RANDOM_KEY_RE.test(value);
        break;
    }

    return valid ? null : { pix: true };
  };
}

/** Infere o tipo de uma chave Pix existente (usado ao editar um favorecido). */
export function detectPixKeyType(key: string): PixKeyType {
  const value = (key ?? '').trim();
  if (value.includes('@')) return 'email';
  if (RANDOM_KEY_RE.test(value)) return 'aleatoria';

  const digits = onlyDigits(value);
  if (value.startsWith('+') || digits.length === 13) return 'celular';
  if (digits.length === 14) return 'cnpj';
  if (digits.length === 11) return isValidCpf(digits) ? 'cpf' : 'celular';
  if (digits.length === 10) return 'celular';
  return 'aleatoria';
}
