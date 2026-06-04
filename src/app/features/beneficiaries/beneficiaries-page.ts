import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-beneficiaries-page',
  standalone: true,
  imports: [EmptyStateComponent, MatButtonModule, MatIconModule, PageHeaderComponent, RouterLink],
  template: `
    <app-page-header
      eyebrow="Favorecidos"
      title="Favorecidos Pix"
      description="Cadastro, edição, remoção e detalhes entram quando a camada de serviços estiver pronta."
    >
      <a pageHeaderActions mat-flat-button routerLink="/app/beneficiaries/demo">
        <mat-icon aria-hidden="true">visibility</mat-icon>
        Ver detalhe demo
      </a>
    </app-page-header>

    <app-empty-state
      icon="group_add"
      title="Nenhum favorecido cadastrado"
      description="A listagem será conectada aos endpoints REST simulados na Fase 4."
      actionLabel="Adicionar favorecido"
    />
  `,
})
export class BeneficiariesPageComponent {}
