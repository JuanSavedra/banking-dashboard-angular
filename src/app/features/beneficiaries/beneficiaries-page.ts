import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Beneficiary } from '../../core/models/banking';
import {
  createBeneficiary,
  loadBeneficiaries,
} from '../../core/store/beneficiaries/beneficiaries.actions';
import {
  selectAllBeneficiaries,
  selectBeneficiariesError,
  selectBeneficiariesLoading,
} from '../../core/store/beneficiaries/beneficiaries.selectors';
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
      description="Lista de favorecidos Pix com detalhe navegável."
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
        description="Não foi possível carregar os favorecidos. Tente novamente."
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

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  protected loadBeneficiaries(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  protected createDemoBeneficiary(): void {
    this.store.dispatch(
      createBeneficiary({
        payload: {
          name: 'Contato Demo',
          bank: 'Banco Operacional',
          document: '111.222.333-44',
          pixKey: 'contato-demo@email.dev',
        },
      }),
    );
  }

  protected statusLabel(status: Beneficiary['status']): string {
    return status === 'active' ? 'Ativo' : 'Pendente';
  }

  protected statusVariant(status: Beneficiary['status']): StatusBadgeVariant {
    return status === 'active' ? 'success' : 'warning';
  }
}
