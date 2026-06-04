import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { Card, CardPurchase, UpdateCardPayload } from '../../core/models/banking';
import { loadCards, updateCard } from '../../core/store/cards/cards.actions';
import {
  selectAllCards,
  selectCardsError,
  selectCardsLoading,
  selectCardsSubmitting,
} from '../../core/store/cards/cards.selectors';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../../shared/components/status-badge/status-badge';

type LimitForm = FormGroup<{ availableLimit: FormControl<number> }>;

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    StatusBadgeComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Cartões"
      title="Cartões e limites"
      description="Acompanhe limites, status e compras recentes dos seus cartões."
    />

    @if (loading()) {
      <app-loading-state label="Carregando cartões" [rows]="4" />
    } @else if (error()) {
      <app-error-state
        title="Não foi possível carregar cartões"
        description="Não foi possível carregar os cartões. Tente novamente."
        actionLabel="Recarregar cartões"
        (action)="loadCards()"
      />
    } @else if (!cards().length) {
      <app-empty-state
        icon="credit_card"
        title="Nenhum cartão encontrado"
        description="Nenhum cartão encontrado na sua conta."
      />
    } @else {
      <section class="cards-grid" aria-label="Cartões da conta">
        @for (card of cards(); track card.id) {
          <article class="card-panel">
            <div class="card-panel__heading">
              <div>
                <span>{{ typeLabel(card.type) }}</span>
                <h2>Final {{ card.finalDigits }}</h2>
              </div>
              <app-status-badge
                [label]="statusLabel(card.status)"
                [variant]="statusVariant(card.status)"
              />
            </div>

            <dl class="card-panel__limits">
              <div>
                <dt>Limite total</dt>
                <dd>{{ formatCurrency(card.limit) }}</dd>
              </div>
              <div>
                <dt>Disponível</dt>
                <dd>{{ formatCurrency(card.availableLimit) }}</dd>
              </div>
              <div>
                <dt>Vencimento</dt>
                <dd>Dia {{ card.dueDay }}</dd>
              </div>
            </dl>

            <form
              class="limit-form"
              [formGroup]="limitForm(card)"
              (ngSubmit)="submitLimit(card)"
              novalidate
            >
              <mat-form-field appearance="outline">
                <mat-label>Ajustar limite disponível</mat-label>
                <input
                  matInput
                  type="number"
                  min="0"
                  [max]="card.limit"
                  step="0.01"
                  formControlName="availableLimit"
                />
                <span matTextPrefix>R$&nbsp;</span>
                @if (limitForm(card).controls.availableLimit.hasError('required')) {
                  <mat-error>Informe o limite disponível.</mat-error>
                } @else if (limitForm(card).controls.availableLimit.hasError('min')) {
                  <mat-error>O limite não pode ser negativo.</mat-error>
                } @else if (limitForm(card).controls.availableLimit.hasError('max')) {
                  <mat-error>O limite disponível não pode passar do limite total.</mat-error>
                }
              </mat-form-field>

              <button mat-button type="submit" [disabled]="submitting()">
                <mat-icon aria-hidden="true">save</mat-icon>
                Salvar limite
              </button>
            </form>

            <section class="purchases" aria-label="Compras recentes">
              <div class="purchases__heading">
                <h3>Compras recentes</h3>
                <span>{{ card.recentPurchases.length }} lançamentos</span>
              </div>

              @if (card.recentPurchases.length) {
                <ul>
                  @for (purchase of card.recentPurchases; track purchase.id) {
                    <li>
                      <div>
                        <strong>{{ purchase.description }}</strong>
                        <span>{{ purchase.merchant }} · {{ formatDate(purchase.occurredAt) }}</span>
                      </div>
                      <div class="purchase-meta">
                        <strong>{{ formatCurrency(purchase.amount) }}</strong>
                        <app-status-badge
                          [label]="purchaseStatusLabel(purchase)"
                          [variant]="purchaseStatusVariant(purchase)"
                        />
                      </div>
                    </li>
                  }
                </ul>
              } @else {
                <p>Nenhuma compra recente para este cartão.</p>
              }
            </section>

            <button
              mat-flat-button
              type="button"
              [disabled]="submitting()"
              (click)="confirmStatus(card)"
            >
              <mat-icon aria-hidden="true">{{
                card.status === 'active' ? 'lock' : 'lock_open'
              }}</mat-icon>
              {{ card.status === 'active' ? 'Bloquear cartão' : 'Desbloquear cartão' }}
            </button>
          </article>
        }
      </section>
    }
  `,
  styles: [
    `
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        gap: var(--app-space-4);
      }

      .card-panel {
        display: grid;
        gap: var(--app-space-5);
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      .card-panel__heading,
      .purchases__heading,
      .purchases li {
        display: flex;
        gap: var(--app-space-4);
        align-items: flex-start;
        justify-content: space-between;
      }

      h2,
      h3 {
        margin: 0;
        font-size: var(--app-font-size-title);
      }

      h2 {
        margin-top: var(--app-space-2);
      }

      span,
      dt,
      .purchases p {
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
      }

      dt {
        font-weight: 700;
      }

      .card-panel__limits,
      .purchases ul {
        display: grid;
        gap: var(--app-space-3);
        margin: 0;
      }

      dd {
        margin: var(--app-space-1) 0 0;
        font-weight: 700;
      }

      .limit-form {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--app-space-3);
        align-items: flex-start;
      }

      .purchases {
        display: grid;
        gap: var(--app-space-3);
        padding: var(--app-space-4);
        border-radius: var(--app-radius-md);
        background: var(--app-color-surface);
      }

      .purchases ul {
        padding: 0;
        list-style: none;
      }

      .purchases li {
        padding-top: var(--app-space-3);
        border-top: var(--app-border-subtle);
      }

      .purchases li:first-child {
        padding-top: 0;
        border-top: 0;
      }

      .purchases strong,
      .purchases span {
        display: block;
      }

      .purchase-meta {
        display: grid;
        justify-items: end;
        gap: var(--app-space-2);
        white-space: nowrap;
      }

      @media (max-width: 48rem) {
        .limit-form,
        .purchases li {
          grid-template-columns: 1fr;
        }

        .limit-form {
          display: grid;
        }

        .purchases li {
          display: grid;
        }

        .purchase-meta {
          justify-items: start;
        }
      }
    `,
  ],
})
export class CardsPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly store = inject(Store);

  protected readonly cards = toSignal(this.store.select(selectAllCards), { initialValue: [] });
  protected readonly loading = toSignal(this.store.select(selectCardsLoading), {
    initialValue: true,
  });
  protected readonly error = toSignal(this.store.select(selectCardsError), {
    initialValue: false,
  });
  protected readonly submitting = toSignal(this.store.select(selectCardsSubmitting), {
    initialValue: false,
  });
  protected readonly limitForms: Record<string, LimitForm> = {};

  ngOnInit(): void {
    this.loadCards();
  }

  protected loadCards(): void {
    this.store.dispatch(loadCards());
  }

  protected submitLimit(card: Card): void {
    const form = this.limitForm(card);

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.updateCard(card.id, { availableLimit: form.controls.availableLimit.value });
  }

  protected confirmStatus(card: Card): void {
    const status = card.status === 'active' ? 'blocked' : 'active';
    const data: ConfirmDialogData = {
      title: status === 'blocked' ? 'Bloquear cartão' : 'Desbloquear cartão',
      description:
        status === 'blocked'
          ? `Bloquear o cartão final ${card.finalDigits}?`
          : `Desbloquear o cartão final ${card.finalDigits}?`,
      confirmLabel: status === 'blocked' ? 'Bloquear cartão' : 'Desbloquear cartão',
      cancelLabel: 'Cancelar',
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '22rem' })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.updateCard(card.id, { status });
        }
      });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
  }

  protected formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
    }).format(new Date(value));
  }

  protected statusLabel(status: Card['status']): string {
    return status === 'active' ? 'Ativo' : 'Bloqueado';
  }

  protected statusVariant(status: Card['status']): StatusBadgeVariant {
    return status === 'active' ? 'success' : 'warning';
  }

  protected typeLabel(type: Card['type']): string {
    return type === 'physical' ? 'Cartão físico' : 'Cartão virtual';
  }

  protected purchaseStatusLabel(purchase: CardPurchase): string {
    return purchase.status === 'approved' ? 'Aprovada' : 'Processando';
  }

  protected purchaseStatusVariant(purchase: CardPurchase): StatusBadgeVariant {
    return purchase.status === 'approved' ? 'success' : 'info';
  }

  protected limitForm(card: Card): LimitForm {
    this.ensureLimitForm(card);
    return this.limitForms[card.id];
  }

  private updateCard(id: string, payload: UpdateCardPayload): void {
    this.store.dispatch(updateCard({ id, payload }));
  }

  private ensureLimitForm(card: Card): void {
    if (this.limitForms[card.id]) {
      return;
    }

    this.limitForms[card.id] = this.fb.group({
      availableLimit: [
        card.availableLimit,
        [Validators.required, Validators.min(0), Validators.max(card.limit)],
      ],
    });
  }
}
