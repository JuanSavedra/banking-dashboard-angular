import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectIsAuthenticated } from '../../core/store/auth/auth.selectors';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, PageHeaderComponent, RouterLink],
  template: `
    <main class="not-found">
      <app-page-header
        eyebrow="404"
        title="Página não encontrada"
        description="A rota solicitada não existe no Banking Dashboard."
      >
        <a pageHeaderActions mat-flat-button [routerLink]="targetRoute()">{{ actionLabel() }}</a>
      </app-page-header>
    </main>
  `,
  styles: [
    `
      .not-found {
        width: min(100% - 2rem, 72rem);
        margin: 0 auto;
        padding: var(--app-space-10) 0;
      }
    `,
  ],
})
export class NotFoundPageComponent {
  private readonly store = inject(Store);
  private readonly isAuthenticated = toSignal(this.store.select(selectIsAuthenticated), {
    initialValue: false,
  });

  protected readonly targetRoute = computed(() =>
    this.isAuthenticated() ? '/app/dashboard' : '/login',
  );

  protected readonly actionLabel = computed(() =>
    this.isAuthenticated() ? 'Voltar ao Dashboard' : 'Ir para Login',
  );
}
