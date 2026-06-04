import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Transaction } from '../../core/models/banking';
import { TransactionsService } from '../../core/services/transactions';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Extrato"
      title="Extrato da conta"
      description="Movimentações e lançamentos da sua conta."
    />

    @if (loading()) {
      <app-loading-state label="Carregando extrato" [rows]="6" />
    } @else if (error()) {
      <app-error-state
        title="Não foi possível carregar o extrato"
        description="Não foi possível carregar o extrato. Tente novamente."
        actionLabel="Recarregar extrato"
        (action)="loadTransactions()"
      />
    } @else if (!transactions().length) {
      <app-empty-state
        icon="receipt_long"
        title="Nenhuma transação encontrada"
        description="Nenhuma movimentação encontrada na conta."
      />
    } @else {
      <section class="transactions-panel" aria-label="Lista de transações">
        @for (transaction of transactions(); track transaction.id) {
          <article>
            <div>
              <strong>{{ transaction.description }}</strong>
              <span>{{ transaction.counterparty }} · {{ transaction.category }}</span>
            </div>
            <div class="transaction-meta">
              <strong [class.positive]="transaction.type === 'credit'">
                {{ formatSignedCurrency(transaction) }}
              </strong>
              <span>{{ formatDate(transaction.occurredAt) }}</span>
            </div>
            <app-status-badge
              [label]="statusLabel(transaction.status)"
              [variant]="statusVariant(transaction.status)"
            />
          </article>
        }
      </section>
    }
  `,
  styles: [
    `
      .transactions-panel {
        display: grid;
        gap: var(--app-space-3);
      }

      article {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto auto;
        gap: var(--app-space-4);
        align-items: center;
        padding: var(--app-space-4);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      strong,
      span {
        display: block;
      }

      span {
        margin-top: var(--app-space-1);
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
      }

      .transaction-meta {
        min-width: 9rem;
        text-align: right;
      }

      .positive {
        color: var(--app-color-success);
      }

      @media (max-width: 48rem) {
        article {
          grid-template-columns: 1fr;
        }

        .transaction-meta {
          text-align: left;
        }
      }
    `,
  ],
})
export class TransactionsPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly transactionsService = inject(TransactionsService);

  protected readonly error = signal(false);
  protected readonly loading = signal(true);
  protected readonly transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.loadTransactions();
  }

  protected loadTransactions(): void {
    this.loading.set(true);
    this.error.set(false);

    this.transactionsService
      .getTransactions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (transactions) => {
          this.transactions.set(transactions);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  protected formatSignedCurrency(transaction: Transaction): string {
    const signal = transaction.type === 'credit' ? '+' : '-';
    return `${signal} ${this.formatCurrency(transaction.amount)}`;
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }

  protected statusLabel(status: Transaction['status']): string {
    const labels: Record<Transaction['status'], string> = {
      completed: 'Concluído',
      processing: 'Processando',
      scheduled: 'Agendado',
    };

    return labels[status];
  }

  protected statusVariant(status: Transaction['status']): StatusBadgeVariant {
    const variants: Record<Transaction['status'], StatusBadgeVariant> = {
      completed: 'success',
      processing: 'info',
      scheduled: 'warning',
    };

    return variants[status];
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
  }
}
