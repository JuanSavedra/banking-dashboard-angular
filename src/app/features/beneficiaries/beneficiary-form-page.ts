import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { BeneficiaryStatus } from '../../core/models/banking';
import { maskCnpj, maskCpf, maskCpfCnpj, maskPhone } from '../../core/utils/masks';
import {
  cpfOrCnpjValidator,
  detectPixKeyType,
  PixKeyType,
  pixKeyValidator,
} from '../../core/validators/document.validators';
import {
  createBeneficiary,
  createBeneficiarySuccess,
  loadBeneficiaries,
  updateBeneficiary,
  updateBeneficiarySuccess,
} from '../../core/store/beneficiaries/beneficiaries.actions';
import {
  selectBeneficiariesError,
  selectBeneficiariesLoading,
  selectBeneficiariesSubmitting,
  selectBeneficiaryById,
} from '../../core/store/beneficiaries/beneficiaries.selectors';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-beneficiary-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ErrorStateComponent,
    LoadingStateComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <app-page-header
      eyebrow="Favorecidos"
      [title]="isEditing() ? 'Editar favorecido' : 'Novo favorecido'"
      [description]="
        isEditing()
          ? 'Atualize os dados antes de realizar novas transferências.'
          : 'Cadastre um contato para realizar transferências Pix com segurança.'
      "
    />

    @if (isEditing() && loading()) {
      <app-loading-state label="Carregando favorecido" [rows]="4" />
    } @else if (isEditing() && !beneficiary()) {
      <app-error-state
        title="Favorecido não encontrado"
        description="Não foi possível localizar os dados para edição."
        actionLabel="Recarregar"
        (action)="reload()"
      />
    } @else {
      <section class="beneficiary-form-panel" aria-labelledby="beneficiary-form-title">
        <h2 id="beneficiary-form-title">Dados cadastrais</h2>

        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          novalidate
          class="beneficiary-form"
          [attr.aria-busy]="submitting()"
        >
          <mat-form-field appearance="outline">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="name" autocomplete="name" />
            @if (form.controls.name.hasError('required') && form.controls.name.touched) {
              <mat-error>Informe o nome do favorecido.</mat-error>
            } @else if (form.controls.name.hasError('minlength') && form.controls.name.touched) {
              <mat-error>Informe pelo menos 3 caracteres.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Banco</mat-label>
            <input matInput formControlName="bank" autocomplete="off" />
            @if (form.controls.bank.hasError('required') && form.controls.bank.touched) {
              <mat-error>Informe o banco.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Documento</mat-label>
            <input matInput formControlName="document" inputmode="numeric" autocomplete="off" />
            @if (form.controls.document.hasError('required') && form.controls.document.touched) {
              <mat-error>Informe CPF ou CNPJ.</mat-error>
            } @else if (
              form.controls.document.hasError('document') && form.controls.document.touched
            ) {
              <mat-error>CPF ou CNPJ inválido.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tipo de chave Pix</mat-label>
            <mat-select formControlName="pixKeyType">
              @for (type of pixKeyTypes; track type.value) {
                <mat-option [value]="type.value">{{ type.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Chave Pix</mat-label>
            <input
              matInput
              formControlName="pixKey"
              [attr.inputmode]="
                form.controls.pixKeyType.value === 'email'
                  ? 'email'
                  : form.controls.pixKeyType.value === 'aleatoria'
                    ? 'text'
                    : 'numeric'
              "
              autocomplete="off"
            />
            @if (form.controls.pixKey.hasError('required') && form.controls.pixKey.touched) {
              <mat-error>Informe a chave Pix.</mat-error>
            } @else if (form.controls.pixKey.hasError('pix') && form.controls.pixKey.touched) {
              <mat-error>Chave Pix inválida para o tipo selecionado.</mat-error>
            }
          </mat-form-field>

          @if (isEditing()) {
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="active">Ativo</mat-option>
                <mat-option value="pending">Pendente</mat-option>
              </mat-select>
            </mat-form-field>
          }

          @if (error()) {
            <p class="beneficiary-form__error" role="alert">
              Não foi possível salvar o favorecido. Revise os dados e tente novamente.
            </p>
          }

          <p class="app-sr-only" aria-live="polite">
            {{ submitting() ? 'Salvando favorecido.' : '' }}
          </p>

          <div class="beneficiary-form__actions">
            <a mat-button routerLink="/app/beneficiaries">Cancelar</a>
            <button mat-flat-button type="submit" [disabled]="submitting()">
              <mat-icon aria-hidden="true">save</mat-icon>
              {{ submitting() ? 'Salvando' : 'Salvar favorecido' }}
            </button>
          </div>
        </form>
      </section>
    }
  `,
  styles: [
    `
      .beneficiary-form-panel {
        max-width: 42rem;
        padding: var(--app-space-6);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      h2 {
        margin: 0 0 var(--app-space-6);
        font-size: var(--app-font-size-title);
      }

      .beneficiary-form {
        display: grid;
        gap: var(--app-space-2);
      }

      mat-form-field {
        width: 100%;
      }

      .beneficiary-form__error {
        margin: 0;
        padding: var(--app-space-3) var(--app-space-4);
        border-radius: var(--app-radius-md);
        background: var(--app-color-error-soft);
        color: var(--app-color-error);
        font-size: var(--app-font-size-label);
      }

      .beneficiary-form__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--app-space-3);
        align-items: center;
        justify-content: flex-end;
        margin-top: var(--app-space-2);
      }

      @media (max-width: 48rem) {
        .beneficiary-form-panel {
          padding: var(--app-space-4);
        }

        .beneficiary-form__actions {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class BeneficiaryFormPageComponent implements OnInit {
  private readonly actions$ = inject(Actions);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  private readonly beneficiaryId = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly isEditing = computed(() => Boolean(this.beneficiaryId));

  protected readonly beneficiary = toSignal(
    this.store.select(selectBeneficiaryById(this.beneficiaryId)),
  );
  protected readonly loading = toSignal(this.store.select(selectBeneficiariesLoading), {
    initialValue: false,
  });
  protected readonly submitting = toSignal(this.store.select(selectBeneficiariesSubmitting), {
    initialValue: false,
  });
  protected readonly error = toSignal(this.store.select(selectBeneficiariesError), {
    initialValue: false,
  });

  protected readonly pixKeyTypes: { value: PixKeyType; label: string }[] = [
    { value: 'celular', label: 'Celular' },
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'email', label: 'E-mail' },
    { value: 'aleatoria', label: 'Chave aleatória' },
  ];

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    bank: ['', Validators.required],
    document: ['', [Validators.required, cpfOrCnpjValidator]],
    pixKeyType: ['celular' as PixKeyType, Validators.required],
    pixKey: ['', [Validators.required, pixKeyValidator('celular')]],
    status: ['active' as BeneficiaryStatus],
  });

  constructor() {
    effect(() => {
      const beneficiary = this.beneficiary();

      if (!beneficiary || this.form.dirty) {
        return;
      }

      // pixKeyType primeiro: ajusta o validador/máscara antes de popular a chave.
      this.form.patchValue({
        pixKeyType: detectPixKeyType(beneficiary.pixKey),
        name: beneficiary.name,
        bank: beneficiary.bank,
        document: beneficiary.document,
        pixKey: beneficiary.pixKey,
        status: beneficiary.status,
      });
    });

    this.form.controls.document.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.applyMask(this.form.controls.document, maskCpfCnpj(value)));

    this.form.controls.pixKey.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.applyMask(this.form.controls.pixKey, this.maskPixKey(value)));

    this.form.controls.pixKeyType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type) => {
        this.form.controls.pixKey.setValidators([Validators.required, pixKeyValidator(type)]);
        this.applyMask(this.form.controls.pixKey, this.maskPixKey(this.form.controls.pixKey.value));
        this.form.controls.pixKey.updateValueAndValidity();
      });
  }

  private maskPixKey(value: string): string {
    switch (this.form.controls.pixKeyType.value) {
      case 'celular':
        return maskPhone(value);
      case 'cpf':
        return maskCpf(value);
      case 'cnpj':
        return maskCnpj(value);
      default:
        return value;
    }
  }

  private applyMask(control: FormControl<string>, masked: string): void {
    if (masked !== control.value) {
      control.setValue(masked, { emitEvent: false });
    }
  }

  ngOnInit(): void {
    if (this.isEditing()) {
      this.reload();
    }
  }

  protected reload(): void {
    this.store.dispatch(loadBeneficiaries());
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isEditing()) {
      this.actions$
        .pipe(ofType(updateBeneficiarySuccess), take(1), takeUntilDestroyed(this.destroyRef))
        .subscribe(({ beneficiary }) => {
          this.snackBar.open('Favorecido atualizado.', 'Fechar', { duration: 3000 });
          void this.router.navigate(['/app/beneficiaries', beneficiary.id]);
        });

      const { name, bank, document, pixKey, status } = value;
      this.store.dispatch(
        updateBeneficiary({
          id: this.beneficiaryId,
          payload: { name, bank, document, pixKey, status },
        }),
      );
      return;
    }

    const { name, bank, document, pixKey } = value;
    this.actions$
      .pipe(ofType(createBeneficiarySuccess), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(({ beneficiary }) => {
        this.snackBar.open('Favorecido cadastrado.', 'Fechar', { duration: 3000 });
        void this.router.navigate(['/app/beneficiaries', beneficiary.id]);
      });

    this.store.dispatch(createBeneficiary({ payload: { name, bank, document, pixKey } }));
  }
}
