import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-beneficiary-detail-page',
  standalone: true,
  imports: [PageHeaderComponent, StatusBadgeComponent],
  template: `
    <app-page-header
      eyebrow="Detalhes do favorecido"
      title="Favorecido {{ beneficiaryId }}"
      description="Prévia da rota dinâmica /app/beneficiaries/:id."
    />

    <section class="detail-card">
      <div>
        <span>Chave Pix</span>
        <strong>demo&#64;pix.local</strong>
      </div>
      <div>
        <span>Status</span>
        <app-status-badge label="Verificado" variant="success" />
      </div>
      <div>
        <span>Próxima fase</span>
        <strong>Dados via API fake</strong>
      </div>
    </section>
  `,
  styles: [
    `
      .detail-card {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: var(--app-space-4);
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
        margin-bottom: var(--app-space-2);
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
        font-weight: 700;
      }
    `,
  ],
})
export class BeneficiaryDetailPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly beneficiaryId = this.route.snapshot.paramMap.get('id') ?? 'demo';
}
