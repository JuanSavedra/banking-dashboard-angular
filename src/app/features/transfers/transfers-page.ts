import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { loadBeneficiaries } from '../../core/store/beneficiaries/beneficiaries.actions';
import {
  selectAllBeneficiaries,
  selectBeneficiariesError,
  selectBeneficiariesLoading,
} from '../../core/store/beneficiaries/beneficiaries.selectors';
import { createTransfer } from '../../core/store/transfers/transfers.actions';
import {
  selectTransferError,
  selectTransferReceipt,
  selectTransferSubmitting,
} from '../../core/store/transfers/transfers.selectors';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-transfers-page',
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
      eyebrow="Transferência"
      title="Transferência Pix"
      description="Envie uma transferência Pix para um favorecido cadastrado."
    />

    @if (loading()) {
      <app-loading-state label="Carregando favorecidos para transferência" [rows]="4" />
    } @else if (error()) {
      <app-error-state
        title="Não foi possível preparar a transferência"
        description="Não foi possível carregar os favorecidos. Tente novamente."
        actionLabel="Recarregar favorecidos"
        (action)="loadBeneficiaries()"
      />
    } @else if (!beneficiaries().length) {
      <app-empty-state
        icon="group_add"
        title="Cadastre um favorecido"
        description="Cadastre um favorecido para realizar transferências Pix."
      />
    } @else {
      <section class="transfer-panel" aria-label="Transferência demo">
        <div>
          <h2>Transferência demo</h2>
          <p>Envia R$ 120,00 para {{ beneficiaries()[0].name }} e gera um comprovante de transferência.</p>
        </div>

        <button
          mat-flat-button
          type="button"
          [disabled]="submitting()"
          (click)="createDemoTransfer()"
        >
          <mat-icon aria-hidden="true">send</mat-icon>
          {{ submitting() ? 'Enviando' : 'Criar transferência demo' }}
        </button>
      </section>

      @if (receipt()) {
        <section class="receipt-panel" aria-label="Comprovante de transferência">
          <app-status-badge label="Concluído" variant="success" />
          <h2>Comprovante {{ receipt()?.receiptCode }}</h2>
          <p>Valor: {{ formatCurrency(receipt()?.amount ?? 0) }}</p>
          <p>Data: {{ formatDate(receipt()?.createdAt ?? '') }}</p>
        </section>
      }
    }
  `,
  styles: [
    `
      .transfer-panel,
      .receipt-panel {
        display: grid;
        gap: var(--app-space-4);
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      .transfer-panel {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
      }

      .receipt-panel {
        margin-top: var(--app-space-4);
      }

      h2 {
        margin: 0;
        font-size: var(--app-font-size-title);
      }

      p {
        margin: var(--app-space-2) 0 0;
        color: var(--app-color-muted);
      }

      @media (max-width: 48rem) {
        .transfer-panel {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TransfersPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly beneficiaries = toSignal(this.store.select(selectAllBeneficiaries), {
    initialValue: [],
  });
  protected readonly loading = toSignal(this.store.select(selectBeneficiariesLoading), {
    initialValue: true,
  });
  protected readonly error = toSignal(this.store.select(selectBeneficiariesError), {
    initialValue: false,
  });
  protected readonly receipt = toSignal(this.store.select(selectTransferReceipt));
  protected readonly submitting = toSignal(this.store.select(selectTransferSubmitting), {
    initialValue: false,
  });

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  protected loadBeneficiaries(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  protected createDemoTransfer(): void {
    const beneficiary = this.beneficiaries()[0];

    if (!beneficiary) {
      return;
    }

    this.store.dispatch(
      createTransfer({
        payload: {
          beneficiaryId: beneficiary.id,
          amount: 120,
          description: 'Transferência demo da Fase 5',
        },
      }),
    );
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
  }

  protected formatDate(value: string): string {
    if (!value) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
