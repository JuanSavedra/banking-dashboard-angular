import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

/**
 * URL base da API REST. Injetada nos services para evitar URLs hardcoded e
 * permitir troca por ambiente (`environment.apiBaseUrl`).
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
