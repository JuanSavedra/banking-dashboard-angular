import { Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header
      eyebrow="Perfil"
      title="Dados e segurança"
      description="Página reservada para dados pessoais, preferências e segurança do usuário."
    />

    <section class="profile-grid">
      <article>
        <span>Usuário demo</span>
        <strong>Ana Souza</strong>
        <p>ana&#64;banking.dev</p>
      </article>
      <article>
        <span>Segurança</span>
        <strong>Senha configurada</strong>
        <app-status-badge label="Ambiente demo" variant="info" />
      </article>
    </section>
  `,
  styles: [
    `
      .profile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        gap: var(--app-space-4);
      }

      article {
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
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
        font-weight: 700;
      }

      strong {
        margin-top: var(--app-space-3);
        font-size: var(--app-font-size-title);
      }

      p {
        color: var(--app-color-muted);
      }
    `,
  ],
})
export class ProfilePageComponent {}
