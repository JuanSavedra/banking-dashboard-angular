import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { Account, Transaction } from '../../core/models/banking';
import { AccountService } from '../../core/services/account';
import { TransactionsService } from '../../core/services/transactions';
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
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly account = signal<Account | null>(null);
  protected readonly error = signal(false);
  protected readonly loading = signal(true);
  protected readonly transactions = signal<Transaction[]>([]);

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
    this.loading.set(true);
    this.error.set(false);

    forkJoin({
      account: this.accountService.getAccount(),
      transactions: this.transactionsService.getTransactions(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ account, transactions }) => {
          this.account.set(account);
          this.transactions.set(transactions);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
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
    const signal = transaction.type === 'credit' ? '+' : '-';
    return `${signal} ${this.formatCurrency(transaction.amount)}`;
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
