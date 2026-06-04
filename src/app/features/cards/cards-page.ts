import { Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { SummaryCardComponent } from '../../shared/components/summary-card/summary-card';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [PageHeaderComponent, StatusBadgeComponent, SummaryCardComponent],
  template: `
    <app-page-header
      eyebrow="Cartões"
      title="Cartões e limites"
      description="Visualização de limite, status e ações simuladas será detalhada antes da API fake."
    />

    <section class="cards-grid" aria-label="Resumo dos cartões">
      <app-summary-card
        label="Limite disponível"
        value="R$ 4.800,00"
        description="Cartão final 4482"
        icon="credit_card"
        tone="positive"
      />
      <article>
        <h2>Cartão virtual</h2>
        <p>Bloqueio, desbloqueio e dados sensíveis serão simulados em fases futuras.</p>
        <app-status-badge label="Ativo" variant="success" />
      </article>
    </section>
  `,
  styles: [
    `
      .cards-grid {
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

      h2 {
        margin: 0;
        font-size: var(--app-font-size-title);
      }

      p {
        margin: var(--app-space-3) 0 var(--app-space-4);
        color: var(--app-color-muted);
        line-height: 1.6;
      }
    `,
  ],
})
export class CardsPageComponent {}
