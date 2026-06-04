import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-not-found-page',
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
  private readonly authService = inject(AuthService);

  protected readonly targetRoute = computed(() =>
    this.authService.isAuthenticated() ? '/app/dashboard' : '/login',
  );

  protected readonly actionLabel = computed(() =>
    this.authService.isAuthenticated() ? 'Voltar ao Dashboard' : 'Ir para Login',
  );
}
