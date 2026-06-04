import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { Beneficiary } from '../../core/models/banking';
import { BeneficiariesService } from '../../core/services/beneficiaries';
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
    PageHeaderComponent,
    StatusBadgeComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Detalhes do favorecido"
      [title]="beneficiary()?.name ?? 'Favorecido'"
      description="Dados retornados pelo endpoint REST fake de detalhe."
    />

    @if (loading()) {
      <app-loading-state label="Carregando favorecido" [rows]="4" />
    } @else if (error()) {
      <app-error-state
        title="Favorecido não encontrado"
        description="A API fake não encontrou dados para a rota informada."
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
  private readonly beneficiariesService = inject(BeneficiariesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  protected readonly beneficiary = signal<Beneficiary | null>(null);
  protected readonly error = signal(false);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.loadBeneficiary();
  }

  protected loadBeneficiary(): void {
    const beneficiaryId = this.route.snapshot.paramMap.get('id');

    if (!beneficiaryId) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.beneficiariesService
      .getBeneficiary(beneficiaryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (beneficiary) => {
          this.beneficiary.set(beneficiary);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  protected statusLabel(status: Beneficiary['status']): string {
    return status === 'active' ? 'Ativo' : 'Pendente';
  }

  protected statusVariant(status: Beneficiary['status']): StatusBadgeVariant {
    return status === 'active' ? 'success' : 'warning';
  }
}
