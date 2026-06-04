import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

import { Beneficiary } from '../../core/models/banking';
import { selectAccount } from '../../core/store/account/account.selectors';
import { loadBeneficiaries } from '../../core/store/beneficiaries/beneficiaries.actions';
import {
  selectAllBeneficiaries,
  selectBeneficiariesError,
  selectBeneficiariesLoading,
} from '../../core/store/beneficiaries/beneficiaries.selectors';
import {
  clearReceipt,
  createTransfer,
} from '../../core/store/transfers/transfers.actions';
import {
  selectTransferError,
  selectTransferReceipt,
  selectTransferSubmitting,
} from '../../core/store/transfers/transfers.selectors';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';
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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    StatusBadgeComponent,
  ],
  templateUrl: './transfers-page.html',
  styleUrl: './transfers-page.scss',
})
export class TransfersPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);

  // ── Store state ───────────────────────────────────────────
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
  protected readonly transferError = toSignal(this.store.select(selectTransferError), {
    initialValue: false,
  });
  private readonly account = toSignal(this.store.select(selectAccount));

  // ── Computed ──────────────────────────────────────────────
  protected readonly selectedBeneficiary = computed<Beneficiary | undefined>(() => {
    const id = this.form.controls.beneficiaryId.value;
    return this.beneficiaries().find((b) => b.id === id);
  });

  // ── Form ──────────────────────────────────────────────────
  protected readonly form = this.fb.group({
    beneficiaryId: ['', Validators.required],
    amount: [null as unknown as number, [Validators.required, Validators.min(0.01)]],
    description: ['Transferência Pix'],
  });

  // ── Effects ───────────────────────────────────────────────
  constructor() {
    effect(() => {
      const receipt = this.receipt();
      if (receipt) {
        this.snackBar.open('Transferência realizada com sucesso!', 'Fechar', { duration: 4000 });
        this.form.reset({ description: 'Transferência Pix' });
      }
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────
  ngOnInit(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  // ── Handlers ─────────────────────────────────────────────
  protected reload(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { amount } = this.form.getRawValue();
    const balance = this.account()?.balance ?? 0;

    if (amount > balance) {
      this.form.controls.amount.setErrors({ maxBalance: true });
      return;
    }

    const beneficiary = this.selectedBeneficiary();
    if (!beneficiary) return;

    const data: ConfirmDialogData = {
      title: 'Confirmar transferência',
      description: `Transferir ${this.formatCurrency(amount)} para ${beneficiary.name} via Pix?`,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '22rem' })
      .afterClosed()
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          const { beneficiaryId, description } = this.form.getRawValue();
          this.store.dispatch(
            createTransfer({ payload: { beneficiaryId, amount, description } }),
          );
        }
      });
  }

  protected newTransfer(): void {
    this.store.dispatch(clearReceipt());
    this.form.reset({ description: 'Transferência Pix' });
  }

  // ── Helpers ───────────────────────────────────────────────
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
  }

  protected formatDate(value: string): string {
    if (!value) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  }
}
