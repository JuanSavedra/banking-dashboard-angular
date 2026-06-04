import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { login } from '../../core/store/auth/auth.actions';
import { selectAuthError } from '../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  protected readonly hasInvalidCredentials = toSignal(this.store.select(selectAuthError), {
    initialValue: false,
  });

  protected readonly form = this.formBuilder.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(
      login({
        credentials: this.form.getRawValue(),
        returnUrl: this.getReturnUrl(),
      }),
    );
  }

  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl?.startsWith('/app') ? returnUrl : '/app/dashboard';
  }
}
