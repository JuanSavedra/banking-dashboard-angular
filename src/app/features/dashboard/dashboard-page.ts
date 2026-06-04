import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

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
  SummaryCardComponent,
  SummaryCardTone,
} from '../../shared/components/summary-card/summary-card';
import { SignedCurrencyPipe } from '../../shared/pipes/signed-currency.pipe';
import { TRANSACTION_STATUS } from '../../shared/status/status-presentation';
import { ActivityItem, RecentTransactionsComponent } from './components/recent-transactions';
import { QuickActionsComponent } from './components/quick-actions';
import { SpendingChartComponent } from './components/spending-chart';

interface DashboardSummary {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: SummaryCardTone;
}

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    QuickActionsComponent,
    RecentTransactionsComponent,
    RouterLink,
    SpendingChartComponent,
    SummaryCardComponent,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  providers: [CurrencyPipe, DatePipe, SignedCurrencyPipe],
})
export class DashboardPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly datePipe = inject(DatePipe);
  private readonly signedCurrencyPipe = inject(SignedCurrencyPipe);

  private readonly accountLoading = toSignal(this.store.select(selectAccountLoading), {
    initialValue: true,
  });
  private readonly accountError = toSignal(this.store.select(selectAccountError), {
    initialValue: false,
  });
  private readonly transactionsLoading = toSignal(this.store.select(selectTransactionsLoading), {
    initialValue: true,
  });
  private readonly transactionsError = toSignal(this.store.select(selectTransactionsError), {
    initialValue: false,
  });

  protected readonly account = toSignal(this.store.select(selectAccount));
  protected readonly transactions = toSignal(this.store.select(selectAllTransactions), {
    initialValue: [],
  });
  protected readonly loading = computed(() => this.accountLoading() || this.transactionsLoading());
  protected readonly error = computed(() => this.accountError() || this.transactionsError());

  protected readonly summaries = computed<DashboardSummary[]>(() => {
    const account = this.account();

    if (!account) {
      return [];
    }

    return [
      {
        label: 'Saldo disponível',
        value: this.currencyPipe.transform(account.balance) ?? '',
        description: `Agência ${account.branch} · Conta ${account.number}`,
        icon: 'account_balance_wallet',
        tone: 'positive',
      },
      {
        label: 'Entradas no mês',
        value: this.currencyPipe.transform(account.incomeThisMonth) ?? '',
        description: 'Créditos confirmados',
        icon: 'trending_up',
        tone: 'positive',
      },
      {
        label: 'Saídas no mês',
        value: this.currencyPipe.transform(account.outcomeThisMonth) ?? '',
        description: 'Débitos, Pix e cartões',
        icon: 'trending_down',
        tone: 'negative',
      },
    ];
  });

  protected readonly activities = computed<ActivityItem[]>(() =>
    this.transactions()
      .slice(0, 5)
      .map((transaction) => {
        const status = TRANSACTION_STATUS[transaction.status];
        const date = this.datePipe.transform(transaction.occurredAt, 'dd MMM, HH:mm');

        return {
          description: transaction.description,
          detail: `${transaction.counterparty} · ${date}`,
          amount: this.signedCurrencyPipe.transform(transaction.amount, transaction.type),
          badge: status.label,
          variant: status.variant,
        };
      }),
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected loadDashboard(): void {
    this.store.dispatch(loadAccount());
    this.store.dispatch(loadTransactions());
  }
}
