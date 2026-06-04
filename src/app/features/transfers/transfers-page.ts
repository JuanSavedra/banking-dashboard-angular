import { Component } from '@angular/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-transfers-page',
  standalone: true,
  imports: [PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header
      eyebrow="Transferência"
      title="Transferência Pix"
      description="Fluxo simulado com favorecido, valor, revisão e comprovante será implementado com formulários."
    />

    <section class="steps" aria-label="Etapas planejadas da transferência">
      @for (step of steps; track step.title) {
        <article>
          <span>{{ step.order }}</span>
          <h2>{{ step.title }}</h2>
          <p>{{ step.description }}</p>
          <app-status-badge label="Planejado" variant="neutral" />
        </article>
      }
    </section>
  `,
  styles: [
    `
      .steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        gap: var(--app-space-4);
      }

      article {
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      article > span {
        color: var(--app-color-primary);
        font-size: var(--app-font-size-label);
        font-weight: 800;
      }

      h2 {
        margin: var(--app-space-3) 0 var(--app-space-2);
        font-size: var(--app-font-size-title);
      }

      p {
        min-height: 3rem;
        margin: 0 0 var(--app-space-4);
        color: var(--app-color-muted);
        line-height: 1.6;
      }
    `,
  ],
})
export class TransfersPageComponent {
  protected readonly steps = [
    {
      order: '01',
      title: 'Favorecido',
      description: 'Selecionar contato ou informar chave Pix.',
    },
    {
      order: '02',
      title: 'Valor',
      description: 'Informar valor, descrição e validar saldo.',
    },
    {
      order: '03',
      title: 'Revisão',
      description: 'Confirmar dados antes da operação sensível.',
    },
    {
      order: '04',
      title: 'Comprovante',
      description: 'Exibir resultado e comprovante simulado.',
    },
  ];
}
