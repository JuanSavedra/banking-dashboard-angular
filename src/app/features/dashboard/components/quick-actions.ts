import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface QuickAction {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-quick-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <nav class="quick-actions" aria-label="Atalhos rápidos">
      <p class="quick-actions__label">Atalhos</p>
      <ul class="quick-actions__list">
        @for (action of actions; track action.label) {
          <li>
            <a [routerLink]="action.route" class="quick-action">
              <mat-icon aria-hidden="true">{{ action.icon }}</mat-icon>
              <span>{{ action.label }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [
    `
      .quick-actions {
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      .quick-actions__label {
        margin: 0 0 var(--app-space-4);
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .quick-actions__list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--app-space-3);
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .quick-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--app-space-2);
        padding: var(--app-space-4) var(--app-space-3);
        border-radius: var(--app-radius-md);
        background: var(--app-color-surface);
        color: var(--app-color-text);
        text-decoration: none;
        font-size: var(--app-font-size-label);
        font-weight: 700;
        text-align: center;
        transition:
          background var(--app-motion-fast),
          color var(--app-motion-fast);

        mat-icon {
          color: var(--app-color-primary);
          font-size: 1.25rem;
          width: 1.25rem;
          height: 1.25rem;
        }

        &:hover {
          background: var(--app-color-surface-selected);
          color: var(--app-color-primary-strong);
        }

        &:focus-visible {
          outline: 0;
          box-shadow: var(--app-shadow-focus);
        }
      }
    `,
  ],
})
export class QuickActionsComponent {
  protected readonly actions: QuickAction[] = [
    { label: 'Transferência', icon: 'swap_horiz', route: '/app/transfers' },
    { label: 'Extrato', icon: 'receipt_long', route: '/app/transactions' },
    { label: 'Favorecidos', icon: 'groups', route: '/app/beneficiaries' },
    { label: 'Cartões', icon: 'credit_card', route: '/app/cards' },
  ];
}
