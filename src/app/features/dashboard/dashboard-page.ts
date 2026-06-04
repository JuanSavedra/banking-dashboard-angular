import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../../shared/components/status-badge/status-badge';
import {
  SummaryCardComponent,
  SummaryCardTone,
} from '../../shared/components/summary-card/summary-card';

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
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    SummaryCardComponent,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPageComponent {
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
}
