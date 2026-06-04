import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Card } from '../../core/models/banking';
import { CardsService } from '../../core/services/cards';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Cartões"
      title="Cartões e limites"
      description="Cartões carregados pela API fake com atualização simples de status."
    />

    @if (loading()) {
      <app-loading-state label="Carregando cartões" [rows]="4" />
    } @else if (error()) {
      <app-error-state
        title="Não foi possível carregar cartões"
        description="A API fake não respondeu à consulta de cartões."
        actionLabel="Recarregar cartões"
        (action)="loadCards()"
      />
    } @else if (!cards().length) {
      <app-empty-state
        icon="credit_card"
        title="Nenhum cartão encontrado"
        description="Os cartões aparecerão quando a API fake retornar dados."
      />
    } @else {
      <section class="cards-grid" aria-label="Resumo dos cartões">
        @for (card of cards(); track card.id) {
          <article>
            <div class="card-heading">
              <div>
                <span>{{ typeLabel(card.type) }}</span>
                <h2>Final {{ card.finalDigits }}</h2>
              </div>
              <app-status-badge
                [label]="statusLabel(card.status)"
                [variant]="statusVariant(card.status)"
              />
            </div>

            <dl>
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

            <button mat-button type="button" (click)="toggleStatus(card)">
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
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
        gap: var(--app-space-4);
      }

      article {
        display: grid;
        gap: var(--app-space-5);
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      .card-heading {
        display: flex;
        gap: var(--app-space-4);
        align-items: flex-start;
        justify-content: space-between;
      }

      h2 {
        margin: var(--app-space-2) 0 0;
        font-size: var(--app-font-size-title);
      }

      span,
      dt {
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
        font-weight: 700;
      }

      dl {
        display: grid;
        gap: var(--app-space-3);
        margin: 0;
      }

      dd {
        margin: var(--app-space-1) 0 0;
        font-weight: 700;
      }
    `,
  ],
})
export class CardsPageComponent implements OnInit {
  private readonly cardsService = inject(CardsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cards = signal<Card[]>([]);
  protected readonly error = signal(false);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.loadCards();
  }

  protected loadCards(): void {
    this.loading.set(true);
    this.error.set(false);

    this.cardsService
      .getCards()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cards) => {
          this.cards.set(cards);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  protected toggleStatus(card: Card): void {
    const status = card.status === 'active' ? 'blocked' : 'active';

    this.cardsService
      .updateCard(card.id, { status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.cards.update((cards) =>
            cards.map((item) => (item.id === updated.id ? updated : item)),
          );
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
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
}
