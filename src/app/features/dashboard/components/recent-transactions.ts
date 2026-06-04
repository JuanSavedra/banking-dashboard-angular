import { Component, Input } from '@angular/core';

import {
  StatusBadgeComponent,
  StatusBadgeVariant,
} from '../../../shared/components/status-badge/status-badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

export interface ActivityItem {
  description: string;
  detail: string;
  amount: string;
  badge: string;
  variant: StatusBadgeVariant;
}

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [EmptyStateComponent, StatusBadgeComponent],
  template: `
    <div class="recent-transactions">
      <div class="recent-transactions__heading">
        <h2 id="activity-title">Atividade recente</h2>
        <p>Últimas movimentações da conta.</p>
      </div>

      @if (activities.length) {
        <ul class="activity-list" aria-labelledby="activity-title">
          @for (activity of activities; track activity.description) {
            <li>
              <div class="activity-list__info">
                <strong>{{ activity.description }}</strong>
                <span>{{ activity.detail }}</span>
              </div>
              <div class="activity-list__meta">
                <strong>{{ activity.amount }}</strong>
                <app-status-badge [label]="activity.badge" [variant]="activity.variant" />
              </div>
            </li>
          }
        </ul>
      } @else {
        <app-empty-state
          icon="receipt_long"
          title="Sem movimentações recentes"
          description="As transações aparecerão aqui quando houver lançamentos disponíveis."
        />
      }
    </div>
  `,
  styles: [
    `
      .recent-transactions {
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      .recent-transactions__heading {
        margin-bottom: var(--app-space-5);

        h2 {
          margin: 0;
          font-size: var(--app-font-size-title);
        }

        p {
          margin: var(--app-space-1) 0 0;
          color: var(--app-color-muted);
          font-size: var(--app-font-size-label);
        }
      }

      .activity-list {
        display: grid;
        gap: var(--app-space-2);
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          display: flex;
          gap: var(--app-space-4);
          align-items: center;
          justify-content: space-between;
          padding: var(--app-space-4);
          border-radius: var(--app-radius-md);
          background: var(--app-color-surface);
        }
      }

      .activity-list__info strong,
      .activity-list__info span {
        display: block;
      }

      .activity-list__info span {
        margin-top: var(--app-space-1);
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
      }

      .activity-list__meta {
        display: grid;
        justify-items: end;
        gap: var(--app-space-2);
        white-space: nowrap;
      }

      @media (max-width: 48rem) {
        .activity-list li {
          display: grid;
        }

        .activity-list__meta {
          justify-items: start;
        }
      }
    `,
  ],
})
export class RecentTransactionsComponent {
  @Input() activities: ActivityItem[] = [];
}
