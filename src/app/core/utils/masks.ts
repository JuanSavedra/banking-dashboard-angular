/** Remove tudo que não for dígito. */
export function onlyDigits(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

/** Aplica máscara progressiva de CPF: 000.000.000-00. */
export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);

  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

/** Aplica máscara progressiva de CNPJ: 00.000.000/0000-00. */
export function maskCnpj(value: string): string {
  const d = onlyDigits(value).slice(0, 14);

  if (d.length > 12) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }
  if (d.length > 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  if (d.length > 5) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length > 2) return `${d.slice(0, 2)}.${d.slice(2)}`;
  return d;
}

/** Escolhe a máscara conforme a quantidade de dígitos (CPF até 11, CNPJ acima). */
export function maskCpfCnpj(value: string): string {
  return onlyDigits(value).length > 11 ? maskCnpj(value) : maskCpf(value);
}

/** Aplica máscara de celular: (00) 00000-0000. */
export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);

  if (d.length < 3) return d;

  const ddd = d.slice(0, 2);
  const rest = d.slice(2);

  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}
