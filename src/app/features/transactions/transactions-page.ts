import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';

import { Transaction, TransactionStatus, TransactionType } from '../../core/models/banking';
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

const PAGE_SIZE = 10;

interface SortOption {
  field: 'date' | 'amount';
  dir: 'asc' | 'desc';
}

interface FilterResult {
  items: Transaction[];
  totalFiltered: number;
  totalAll: number;
  currentPage: number;
  totalPages: number;
}

const EMPTY_RESULT: FilterResult = {
  items: [],
  totalFiltered: 0,
  totalAll: 0,
  currentPage: 1,
  totalPages: 1,
};

@Component({
  selector: 'app-transactions-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    StatusBadgeComponent,
  ],
  templateUrl: './transactions-page.html',
  styleUrl: './transactions-page.scss',
})
export class TransactionsPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  // ── Filter state ──────────────────────────────────────────
  protected readonly searchControl = new FormControl('');
  private readonly typeSubject = new BehaviorSubject<TransactionType | 'all'>('all');
  private readonly statusSubject = new BehaviorSubject<TransactionStatus | 'all'>('all');
  private readonly sortSubject = new BehaviorSubject<SortOption>({ field: 'date', dir: 'desc' });
  private readonly pageSubject = new BehaviorSubject(1);

  // ── Store state ───────────────────────────────────────────
  protected readonly loading = toSignal(this.store.select(selectTransactionsLoading), {
    initialValue: true,
  });
  protected readonly error = toSignal(this.store.select(selectTransactionsError), {
    initialValue: false,
  });

  // ── Reactive filter pipeline ──────────────────────────────
  private readonly result$ = combineLatest([
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      map((v) => (v ?? '').toLowerCase().trim()),
    ),
    this.typeSubject,
    this.statusSubject,
    this.sortSubject,
    this.pageSubject,
    this.store.select(selectAllTransactions),
  ]).pipe(
    map(([search, type, status, sort, page, all]): FilterResult => {
      let filtered = all;

      if (search) {
        filtered = filtered.filter(
          (t) =>
            t.description.toLowerCase().includes(search) ||
            t.counterparty.toLowerCase().includes(search),
        );
      }

      if (type !== 'all') filtered = filtered.filter((t) => t.type === type);
      if (status !== 'all') filtered = filtered.filter((t) => t.status === status);

      filtered = [...filtered].sort((a, b) => {
        const aVal = sort.field === 'date' ? new Date(a.occurredAt).getTime() : a.amount;
        const bVal = sort.field === 'date' ? new Date(b.occurredAt).getTime() : b.amount;
        return sort.dir === 'desc' ? bVal - aVal : aVal - bVal;
      });

      const totalFiltered = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
      const currentPage = Math.min(page, totalPages);

      return {
        items: filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        totalFiltered,
        totalAll: all.length,
        currentPage,
        totalPages,
      };
    }),
  );

  private readonly result = toSignal(this.result$, { initialValue: EMPTY_RESULT });

  protected readonly filteredTransactions = computed(() => this.result().items);
  protected readonly filteredCount = computed(() => this.result().totalFiltered);
  protected readonly totalCount = computed(() => this.result().totalAll);
  protected readonly currentPage = computed(() => this.result().currentPage);
  protected readonly totalPages = computed(() => this.result().totalPages);

  // ── Active filter signals for UI ──────────────────────────
  protected readonly activeType = toSignal(this.typeSubject, {
    initialValue: 'all' as TransactionType | 'all',
  });
  protected readonly activeStatus = toSignal(this.statusSubject, {
    initialValue: 'all' as TransactionStatus | 'all',
  });
  protected readonly activeSortValue = toSignal(
    this.sortSubject.pipe(map((s) => `${s.field}-${s.dir}`)),
    { initialValue: 'date-desc' },
  );

  // ── Filter options ────────────────────────────────────────
  protected readonly typeOptions: { label: string; value: TransactionType | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Crédito', value: 'credit' },
    { label: 'Débito', value: 'debit' },
  ];

  protected readonly statusOptions: { label: string; value: TransactionStatus | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Concluído', value: 'completed' },
    { label: 'Processando', value: 'processing' },
    { label: 'Agendado', value: 'scheduled' },
  ];

  protected readonly sortOptions = [
    { label: 'Mais recentes', value: 'date-desc' },
    { label: 'Mais antigas', value: 'date-asc' },
    { label: 'Maior valor', value: 'amount-desc' },
    { label: 'Menor valor', value: 'amount-asc' },
  ];

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {
    this.store.dispatch(loadTransactions());

    // reset to page 1 on every search keystroke
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.pageSubject.next(1));
  }

  // ── Filter handlers ───────────────────────────────────────
  protected setType(value: TransactionType | 'all'): void {
    this.typeSubject.next(value);
    this.pageSubject.next(1);
  }

  protected setStatus(value: TransactionStatus | 'all'): void {
    this.statusSubject.next(value);
    this.pageSubject.next(1);
  }

  protected onSortChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const [field, dir] = raw.split('-') as [SortOption['field'], SortOption['dir']];
    this.sortSubject.next({ field, dir });
    this.pageSubject.next(1);
  }

  protected reload(): void {
    this.store.dispatch(loadTransactions());
  }

  protected clearSearch(): void {
    this.searchControl.reset('');
  }

  protected prevPage(): void {
    this.pageSubject.next(this.pageSubject.value - 1);
  }

  protected nextPage(): void {
    this.pageSubject.next(this.pageSubject.value + 1);
  }

  // ── Format helpers ────────────────────────────────────────
  protected formatSignedCurrency(transaction: Transaction): string {
    const prefix = transaction.type === 'credit' ? '+' : '-';
    return `${prefix} ${this.formatCurrency(transaction.amount)}`;
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
