import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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

import { Card, UpdateCardPayload } from '../../core/models/banking';
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
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { CardStatusPipe } from '../../shared/pipes/card-status.pipe';
import { CardTypePipe } from '../../shared/pipes/card-type.pipe';
import { PurchaseStatusPipe } from '../../shared/pipes/purchase-status.pipe';

type LimitForm = FormGroup<{ availableLimit: FormControl<number> }>;

@Component({
  selector: 'app-cards-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    CurrencyPipe,
    DatePipe,
    CardStatusPipe,
    CardTypePipe,
    PurchaseStatusPipe,
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
          @let cardState = card.status | cardStatus;
          <article class="card-panel" [attr.aria-labelledby]="'card-title-' + card.id">
            <div class="card-panel__heading">
              <div>
                <span>{{ card.type | cardType }}</span>
                <h2 [id]="'card-title-' + card.id">Final {{ card.finalDigits }}</h2>
              </div>
              <app-status-badge [label]="cardState.label" [variant]="cardState.variant" />
            </div>

            <dl class="card-panel__limits">
              <div>
                <dt>Limite total</dt>
                <dd>{{ card.limit | currency }}</dd>
              </div>
              <div>
                <dt>Disponível</dt>
                <dd>{{ card.availableLimit | currency }}</dd>
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
              [attr.aria-busy]="submitting()"
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

              <button
                mat-button
                type="submit"
                [disabled]="submitting()"
                [attr.aria-label]="'Salvar limite do cartão final ' + card.finalDigits"
              >
                <mat-icon aria-hidden="true">save</mat-icon>
                Salvar limite
              </button>

              <p class="app-sr-only" aria-live="polite">
                {{ submitting() ? 'Atualizando cartão.' : '' }}
              </p>
            </form>

            <section class="purchases" [attr.aria-labelledby]="'card-purchases-title-' + card.id">
              <div class="purchases__heading">
                <h3 [id]="'card-purchases-title-' + card.id">Compras recentes</h3>
                <span>{{ card.recentPurchases.length }} lançamentos</span>
              </div>

              @if (card.recentPurchases.length) {
                <ul>
                  @for (purchase of card.recentPurchases; track purchase.id) {
                    @let purchaseState = purchase.status | purchaseStatus;
                    <li>
                      <div>
                        <strong>{{ purchase.description }}</strong>
                        <span
                          >{{ purchase.merchant }} ·
                          {{ purchase.occurredAt | date: 'dd MMM, HH:mm' }}</span
                        >
                      </div>
                      <div class="purchase-meta">
                        <strong>{{ purchase.amount | currency }}</strong>
                        <app-status-badge
                          [label]="purchaseState.label"
                          [variant]="purchaseState.variant"
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
              [attr.aria-label]="
                (card.status === 'active' ? 'Bloquear' : 'Desbloquear') +
                ' cartão final ' +
                card.finalDigits
              "
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
  private readonly destroyRef = inject(DestroyRef);

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.updateCard(card.id, { status });
        }
      });
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
