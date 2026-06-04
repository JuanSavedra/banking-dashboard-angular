import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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
  selector: 'app-beneficiaries-page',
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
      eyebrow="Favorecidos"
      title="Favorecidos Pix"
      description="Lista carregada por endpoint REST fake com detalhe navegável."
    >
      <button pageHeaderActions mat-flat-button type="button" (click)="createDemoBeneficiary()">
        <mat-icon aria-hidden="true">person_add</mat-icon>
        Criar demo
      </button>
    </app-page-header>

    @if (loading()) {
      <app-loading-state label="Carregando favorecidos" [rows]="5" />
    } @else if (error()) {
      <app-error-state
        title="Não foi possível carregar favorecidos"
        description="A API fake não respondeu à consulta de favorecidos."
        actionLabel="Recarregar favorecidos"
        (action)="loadBeneficiaries()"
      />
    } @else if (!beneficiaries().length) {
      <app-empty-state
        icon="group_add"
        title="Nenhum favorecido cadastrado"
        description="Crie um favorecido demo para validar POST e listagem."
        actionLabel="Criar favorecido demo"
        (action)="createDemoBeneficiary()"
      />
    } @else {
      <section class="beneficiaries-list" aria-label="Lista de favorecidos">
        @for (beneficiary of beneficiaries(); track beneficiary.id) {
          <article>
            <div>
              <strong>{{ beneficiary.name }}</strong>
              <span>{{ beneficiary.bank }} · {{ beneficiary.pixKey }}</span>
            </div>
            <app-status-badge
              [label]="statusLabel(beneficiary.status)"
              [variant]="statusVariant(beneficiary.status)"
            />
            <a mat-button [routerLink]="['/app/beneficiaries', beneficiary.id]">Ver detalhe</a>
          </article>
        }
      </section>
    }
  `,
  styles: [
    `
      .beneficiaries-list {
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

      @media (max-width: 48rem) {
        article {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BeneficiariesPageComponent implements OnInit {
  private readonly beneficiariesService = inject(BeneficiariesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly beneficiaries = signal<Beneficiary[]>([]);
  protected readonly error = signal(false);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  protected loadBeneficiaries(): void {
    this.loading.set(true);
    this.error.set(false);

    this.beneficiariesService
      .getBeneficiaries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (beneficiaries) => {
          this.beneficiaries.set(beneficiaries);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }

  protected createDemoBeneficiary(): void {
    this.beneficiariesService
      .createBeneficiary({
        name: 'Contato Demo',
        bank: 'Banco Operacional',
        document: '111.222.333-44',
        pixKey: 'contato-demo@email.dev',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (beneficiary) => {
          this.beneficiaries.update((items) => [beneficiary, ...items]);
        },
        error: () => {
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
