import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/dashboard',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/app-shell').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/transactions-page').then(
            (m) => m.TransactionsPageComponent,
          ),
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import('./features/transfers/transfers-page').then((m) => m.TransfersPageComponent),
      },
      {
        path: 'beneficiaries',
        loadComponent: () =>
          import('./features/beneficiaries/beneficiaries-page').then(
            (m) => m.BeneficiariesPageComponent,
          ),
      },
      {
        path: 'beneficiaries/:id',
        loadComponent: () =>
          import('./features/beneficiaries/beneficiary-detail-page').then(
            (m) => m.BeneficiaryDetailPageComponent,
          ),
      },
      {
        path: 'cards',
        loadComponent: () =>
          import('./features/cards/cards-page').then((m) => m.CardsPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-page').then((m) => m.ProfilePageComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found-page').then((m) => m.NotFoundPageComponent),
  },
];
