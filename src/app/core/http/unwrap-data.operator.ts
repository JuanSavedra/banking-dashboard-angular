import { map, OperatorFunction } from 'rxjs';

import { ApiResponse } from '../models/banking';

/**
 * Extrai o campo `data` do envelope padrão `ApiResponse<T>` retornado pela API.
 * Centraliza o `map((response) => response.data)` repetido em todos os services.
 */
export function unwrapData<T>(): OperatorFunction<ApiResponse<T>, T> {
  return map((response: ApiResponse<T>) => response.data);
}
