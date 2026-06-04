import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

import { EmptyStateComponent } from './shared/components/empty-state/empty-state';
import { ErrorStateComponent } from './shared/components/error-state/error-state';
import { LoadingStateComponent } from './shared/components/loading-state/loading-state';
import { PageHeaderComponent } from './shared/components/page-header/page-header';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from './shared/components/status-badge/status-badge';
import {
  SummaryCardComponent,
  SummaryCardTone,
} from './shared/components/summary-card/summary-card';

interface NavigationItem {
  label: string;
  icon: string;
  active: boolean;
}

interface DashboardSummary {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: SummaryCardTone;
}

interface ActivityItem {
  description: string;
  detail: string;
  amount: string;
  badge: string;
  variant: StatusBadgeVariant;
}

@Component({
  selector: 'app-root',
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    RouterOutlet,
    StatusBadgeComponent,
    SummaryCardComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly productName = signal('Banking Dashboard');
  protected readonly phase = signal('Fase 2 - Design system e layout base');
  protected readonly menuOpen = signal(false);

  protected readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: 'dashboard', active: true },
    { label: 'Extrato', icon: 'receipt_long', active: false },
    { label: 'Transferência', icon: 'swap_horiz', active: false },
    { label: 'Favorecidos', icon: 'groups', active: false },
    { label: 'Cartões', icon: 'credit_card', active: false },
    { label: 'Perfil', icon: 'person', active: false },
  ];

  protected readonly summaries: DashboardSummary[] = [
    {
      label: 'Saldo disponível',
      value: 'R$ 8.420,90',
      description: 'Conta corrente ativa',
      icon: 'account_balance_wallet',
      tone: 'positive',
    },
    {
      label: 'Entradas no mês',
      value: 'R$ 12.840,00',
      description: '3 créditos confirmados',
      icon: 'trending_up',
      tone: 'positive',
    },
    {
      label: 'Saídas no mês',
      value: 'R$ 4.219,30',
      description: 'Pix, cartão e boletos',
      icon: 'trending_down',
      tone: 'negative',
    },
  ];

  protected readonly activities: ActivityItem[] = [
    {
      description: 'Pix recebido de Marina Lopes',
      detail: 'Hoje, 09:42',
      amount: '+ R$ 1.240,00',
      badge: 'Concluído',
      variant: 'success',
    },
    {
      description: 'Pagamento cartão final 4482',
      detail: 'Ontem, 18:10',
      amount: '- R$ 382,19',
      badge: 'Processado',
      variant: 'info',
    },
    {
      description: 'Transferência para Ricardo Alves',
      detail: 'Ontem, 11:05',
      amount: '- R$ 740,00',
      badge: 'Agendado',
      variant: 'warning',
    },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
