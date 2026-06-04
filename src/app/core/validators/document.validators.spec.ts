import { FormControl } from '@angular/forms';

import {
  cpfOrCnpjValidator,
  detectPixKeyType,
  isValidCnpj,
  isValidCpf,
  pixKeyValidator,
} from './document.validators';

describe('document validators', () => {
  it('validates CPF check digits', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('529.982.247-24')).toBe(false);
    expect(isValidCpf('123')).toBe(false);
  });

  it('validates CNPJ check digits', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    expect(isValidCnpj('11.222.333/0001-80')).toBe(false);
  });

  it('cpfOrCnpjValidator accepts valid CPF/CNPJ and rejects invalid', () => {
    expect(cpfOrCnpjValidator(new FormControl(''))).toBeNull();
    expect(cpfOrCnpjValidator(new FormControl('529.982.247-25'))).toBeNull();
    expect(cpfOrCnpjValidator(new FormControl('11.222.333/0001-81'))).toBeNull();
    expect(cpfOrCnpjValidator(new FormControl('123.456.789-00'))).toEqual({ document: true });
  });
});

describe('pixKeyValidator', () => {
  it('validates per type', () => {
    expect(pixKeyValidator('celular')(new FormControl('(11) 99999-0000'))).toBeNull();
    expect(pixKeyValidator('celular')(new FormControl('123'))).toEqual({ pix: true });
    expect(pixKeyValidator('cpf')(new FormControl('529.982.247-25'))).toBeNull();
    expect(pixKeyValidator('email')(new FormControl('ana@banking.dev'))).toBeNull();
    expect(pixKeyValidator('email')(new FormControl('invalido'))).toEqual({ pix: true });
    expect(
      pixKeyValidator('aleatoria')(new FormControl('123e4567-e89b-12d3-a456-426614174000')),
    ).toBeNull();
  });
});

describe('detectPixKeyType', () => {
  it('infers the key type', () => {
    expect(detectPixKeyType('ana@banking.dev')).toBe('email');
    expect(detectPixKeyType('+5511999990000')).toBe('celular');
    expect(detectPixKeyType('529.982.247-25')).toBe('cpf');
    expect(detectPixKeyType('11.222.333/0001-81')).toBe('cnpj');
    expect(detectPixKeyType('123e4567-e89b-12d3-a456-426614174000')).toBe('aleatoria');
  });
});
