import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { Transaction } from '../../core/models/banking';
import { loadAccount } from '../../core/store/account/account.actions';
import {
  selectAccount,
  selectAccountError,
  selectAccountLoading,
} from '../../core/store/account/account.selectors';
import { loadTransactions } from '../../core/store/transactions/transactions.actions';
import {
  selectAllTransactions,
  selectTransactionsError,
  selectTransactionsLoading,
} from '../../core/store/transactions/transactions.selectors';
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
export class DashboardPageComponent implements OnInit {
  private readonly store = inject(Store);

  private readonly accountLoading = toSignal(this.store.select(selectAccountLoading), {
    initialValue: true,
  });
  private readonly accountError = toSignal(this.store.select(selectAccountError), {
    initialValue: false,
  });
  private readonly transactionsLoading = toSignal(
    this.store.select(selectTransactionsLoading),
    { initialValue: true },
  );
  private readonly transactionsError = toSignal(
    this.store.select(selectTransactionsError),
    { initialValue: false },
  );

  protected readonly account = toSignal(this.store.select(selectAccount));
  protected readonly transactions = toSignal(this.store.select(selectAllTransactions), {
    initialValue: [],
  });
  protected readonly loading = computed(
    () => this.accountLoading() || this.transactionsLoading(),
  );
  protected readonly error = computed(() => this.accountError() || this.transactionsError());

  protected readonly summaries = computed<DashboardSummary[]>(() => {
    const account = this.account();

    if (!account) {
      return [];
    }

    return [
      {
        label: 'Saldo disponível',
        value: this.formatCurrency(account.balance),
        description: `Conta ${account.branch} / ${account.number}`,
        icon: 'account_balance_wallet',
        tone: 'positive',
      },
      {
        label: 'Entradas no mês',
        value: this.formatCurrency(account.incomeThisMonth),
        description: 'Créditos confirmados',
        icon: 'trending_up',
        tone: 'positive',
      },
      {
        label: 'Saídas no mês',
        value: this.formatCurrency(account.outcomeThisMonth),
        description: 'Débitos, Pix e cartões',
        icon: 'trending_down',
        tone: 'negative',
      },
    ];
  });

  protected readonly activities = computed<ActivityItem[]>(() =>
    this.transactions()
      .slice(0, 4)
      .map((transaction) => ({
        description: transaction.description,
        detail: `${transaction.counterparty} · ${this.formatDate(transaction.occurredAt)}`,
        amount: this.formatSignedCurrency(transaction),
        badge: this.statusLabel(transaction.status),
        variant: this.statusVariant(transaction.status),
      })),
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected loadDashboard(): void {
    this.store.dispatch(loadAccount());
    this.store.dispatch(loadTransactions());
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
    }).format(new Date(value));
  }

  private formatSignedCurrency(transaction: Transaction): string {
    const prefix = transaction.type === 'credit' ? '+' : '-';
    return `${prefix} ${this.formatCurrency(transaction.amount)}`;
  }

  private statusLabel(status: Transaction['status']): string {
    const labels: Record<Transaction['status'], string> = {
      completed: 'Concluído',
      processing: 'Processando',
      scheduled: 'Agendado',
    };

    return labels[status];
  }

  private statusVariant(status: Transaction['status']): StatusBadgeVariant {
    const variants: Record<Transaction['status'], StatusBadgeVariant> = {
      completed: 'success',
      processing: 'info',
      scheduled: 'warning',
    };

    return variants[status];
  }
}
