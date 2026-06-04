import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(localePt);
import { accountReducer } from './core/store/account/account.reducer';
import { AccountEffects } from './core/store/account/account.effects';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authReducer } from './core/store/auth/auth.reducer';
import { BeneficiariesEffects } from './core/store/beneficiaries/beneficiaries.effects';
import { beneficiariesReducer } from './core/store/beneficiaries/beneficiaries.reducer';
import { CardsEffects } from './core/store/cards/cards.effects';
import { cardsReducer } from './core/store/cards/cards.reducer';
import { TransactionsEffects } from './core/store/transactions/transactions.effects';
import { transactionsReducer } from './core/store/transactions/transactions.reducer';
import { TransfersEffects } from './core/store/transfers/transfers.effects';
import { transfersReducer } from './core/store/transfers/transfers.reducer';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      account: accountReducer,
      transactions: transactionsReducer,
      beneficiaries: beneficiariesReducer,
      transfers: transfersReducer,
      cards: cardsReducer,
    }),
    provideEffects(
      AuthEffects,
      AccountEffects,
      TransactionsEffects,
      BeneficiariesEffects,
      TransfersEffects,
      CardsEffects,
    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
