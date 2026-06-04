import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Beneficiary } from '../../core/models/banking';
import {
  deleteBeneficiary,
  loadBeneficiaries,
} from '../../core/store/beneficiaries/beneficiaries.actions';
import {
  selectBeneficiariesError,
  selectBeneficiariesLoading,
  selectBeneficiariesSubmitting,
  selectBeneficiaryById,
} from '../../core/store/beneficiaries/beneficiaries.selectors';
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

@Component({
  selector: 'app-beneficiary-detail-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    RouterLink,
    StatusBadgeComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Detalhes do favorecido"
      [title]="beneficiary()?.name ?? 'Favorecido'"
      description="Dados cadastrais usados em transferências Pix."
    >
      @if (beneficiary()) {
        <a
          pageHeaderActions
          mat-button
          [routerLink]="['/app/beneficiaries', beneficiary()!.id, 'edit']"
        >
          <mat-icon aria-hidden="true">edit</mat-icon>
          Editar
        </a>
      }
      @if (beneficiary()) {
        <button
          pageHeaderActions
          mat-flat-button
          type="button"
          [disabled]="submitting()"
          (click)="confirmDelete()"
        >
          <mat-icon aria-hidden="true">delete</mat-icon>
          Excluir
        </button>
      }
    </app-page-header>

    @if (loading()) {
      <app-loading-state label="Carregando favorecido" [rows]="4" />
    } @else if (error()) {
      <app-error-state
        title="Favorecido não encontrado"
        description="Não foi possível localizar os dados do favorecido."
        actionLabel="Recarregar detalhe"
        (action)="loadBeneficiary()"
      />
    } @else if (!beneficiary()) {
      <app-empty-state
        icon="person_search"
        title="Sem dados do favorecido"
        description="Selecione um favorecido pela listagem para consultar detalhes."
      />
    } @else {
      <section class="detail-card" aria-label="Detalhes do favorecido">
        <div>
          <span>Banco</span>
          <strong>{{ beneficiary()?.bank }}</strong>
        </div>
        <div>
          <span>Documento</span>
          <strong>{{ beneficiary()?.document }}</strong>
        </div>
        <div>
          <span>Chave Pix</span>
          <strong>{{ beneficiary()?.pixKey }}</strong>
        </div>
        <div>
          <span>Status</span>
          <app-status-badge
            [label]="statusLabel(beneficiary()?.status ?? 'pending')"
            [variant]="statusVariant(beneficiary()?.status ?? 'pending')"
          />
        </div>
        <div>
          <span>Cadastro</span>
          <strong>{{ formatDate(beneficiary()?.createdAt ?? '') }}</strong>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .detail-card {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: var(--app-space-4);
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      span,
      strong {
        display: block;
      }

      span {
        margin-bottom: var(--app-space-2);
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
        font-weight: 700;
      }
    `,
  ],
})
export class BeneficiaryDetailPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  private readonly beneficiaryId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly beneficiary = toSignal(
    this.store.select(selectBeneficiaryById(this.beneficiaryId)),
  );
  protected readonly loading = toSignal(this.store.select(selectBeneficiariesLoading), {
    initialValue: true,
  });
  protected readonly error = toSignal(this.store.select(selectBeneficiariesError), {
    initialValue: false,
  });
  protected readonly submitting = toSignal(this.store.select(selectBeneficiariesSubmitting), {
    initialValue: false,
  });

  ngOnInit(): void {
    this.loadBeneficiary();
  }

  protected loadBeneficiary(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  protected confirmDelete(): void {
    const beneficiary = this.beneficiary();

    if (!beneficiary) {
      return;
    }

    const data: ConfirmDialogData = {
      title: 'Excluir favorecido',
      description: `Excluir ${beneficiary.name} da lista de favorecidos?`,
      confirmLabel: 'Excluir favorecido',
      cancelLabel: 'Cancelar',
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '22rem' })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.store.dispatch(deleteBeneficiary({ id: beneficiary.id }));
          void this.router.navigate(['/app/beneficiaries']);
        }
      });
  }

  protected statusLabel(status: Beneficiary['status']): string {
    return status === 'active' ? 'Ativo' : 'Pendente';
  }

  protected statusVariant(status: Beneficiary['status']): StatusBadgeVariant {
    return status === 'active' ? 'success' : 'warning';
  }

  protected formatDate(value: string): string {
    if (!value) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
