import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Beneficiary } from '../../core/models/banking';
import {
  deleteBeneficiary,
  loadBeneficiaries,
} from '../../core/store/beneficiaries/beneficiaries.actions';
import {
  selectAllBeneficiaries,
  selectBeneficiariesError,
  selectBeneficiariesLoading,
  selectBeneficiariesSubmitting,
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
  selector: 'app-beneficiaries-page',
  standalone: true,
  imports: [
    ErrorStateComponent,
    EmptyStateComponent,
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
      description="Gerencie contatos autorizados para transferências Pix."
    >
      <a pageHeaderActions mat-flat-button routerLink="/app/beneficiaries/new">
        <mat-icon aria-hidden="true">person_add</mat-icon>
        Novo favorecido
      </a>
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
        description="Cadastre um favorecido para realizar transferências Pix com mais agilidade."
        actionLabel="Novo favorecido"
        (action)="goToNewBeneficiary()"
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
            <div class="beneficiaries-list__actions">
              <a mat-button [routerLink]="['/app/beneficiaries', beneficiary.id]">Ver detalhe</a>
              <a mat-button [routerLink]="['/app/beneficiaries', beneficiary.id, 'edit']">Editar</a>
              <button
                mat-button
                type="button"
                [disabled]="submitting()"
                (click)="confirmDelete(beneficiary)"
              >
                Excluir
              </button>
            </div>
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

      .beneficiaries-list__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--app-space-2);
        justify-content: flex-end;
      }

      @media (max-width: 48rem) {
        article {
          grid-template-columns: 1fr;
        }

        .beneficiaries-list__actions {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class BeneficiariesPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
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
  protected readonly submitting = toSignal(this.store.select(selectBeneficiariesSubmitting), {
    initialValue: false,
  });

  ngOnInit(): void {
    this.loadBeneficiaries();
  }

  protected loadBeneficiaries(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  protected goToNewBeneficiary(): void {
    void this.router.navigate(['/app/beneficiaries/new']);
  }

  protected confirmDelete(beneficiary: Beneficiary): void {
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
        }
      });
  }

  protected statusLabel(status: Beneficiary['status']): string {
    return status === 'active' ? 'Ativo' : 'Pendente';
  }

  protected statusVariant(status: Beneficiary['status']): StatusBadgeVariant {
    return status === 'active' ? 'success' : 'warning';
  }
}
