import { Component } from '@angular/core';

import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [EmptyStateComponent, PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header
      eyebrow="Extrato"
      title="Extrato da conta"
      description="Lista, filtros e detalhe de transações serão conectados à API fake na próxima fase."
    />

    <section class="placeholder-panel" aria-label="Planejamento do extrato">
      <div>
        <h2>Filtros planejados</h2>
        <p>Período, tipo, status e busca textual.</p>
      </div>
      <app-status-badge label="Fase 4" variant="info" />
    </section>

    <app-empty-state
      icon="receipt_long"
      title="Nenhuma transação carregada"
      description="O extrato será preenchido quando os endpoints REST simulados estiverem disponíveis."
      actionLabel="Ver planejamento"
    />
  `,
  styles: [
    `
      .placeholder-panel {
        display: flex;
        gap: var(--app-space-4);
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: var(--app-space-4);
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
        margin: var(--app-space-2) 0 0;
        color: var(--app-color-muted);
      }
    `,
  ],
})
export class TransactionsPageComponent {}
