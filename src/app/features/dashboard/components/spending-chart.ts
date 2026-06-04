import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-spending-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div class="spending-chart">
      <p class="spending-chart__label">Gastos do mês</p>

      <div class="spending-chart__visual">
        <svg
          viewBox="0 0 100 100"
          role="img"
          [attr.aria-label]="'Gráfico de gastos: ' + percentage + ' do rendimento gasto'"
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--app-color-surface-strong)"
            stroke-width="10"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--app-color-primary)"
            stroke-width="10"
            stroke-linecap="round"
            [attr.stroke-dasharray]="circumference"
            [attr.stroke-dashoffset]="dashOffset"
            transform="rotate(-90 50 50)"
          />
          <text
            x="50"
            y="47"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="15"
            font-weight="700"
            fill="var(--app-color-text)"
          >
            {{ percentage }}
          </text>
          <text x="50" y="63" text-anchor="middle" font-size="8" fill="var(--app-color-muted)">
            gasto
          </text>
        </svg>
      </div>

      <ul class="spending-chart__legend">
        <li>
          <span class="legend-dot legend-dot--primary"></span>
          <span>Saídas: {{ formatCurrency(outcome) }}</span>
        </li>
        <li>
          <span class="legend-dot legend-dot--track"></span>
          <span>Entradas: {{ formatCurrency(income) }}</span>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .spending-chart {
        padding: var(--app-space-5);
        border: var(--app-border-subtle);
        border-radius: var(--app-radius-lg);
        background: var(--app-color-background);
      }

      .spending-chart__label {
        margin: 0 0 var(--app-space-4);
        color: var(--app-color-muted);
        font-size: var(--app-font-size-label);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .spending-chart__visual {
        display: flex;
        justify-content: center;
        margin-bottom: var(--app-space-4);

        svg {
          width: 9rem;
          height: 9rem;
        }
      }

      .spending-chart__legend {
        display: grid;
        gap: var(--app-space-2);
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          display: flex;
          align-items: center;
          gap: var(--app-space-2);
          font-size: var(--app-font-size-label);
          color: var(--app-color-muted);
        }
      }

      .legend-dot {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .legend-dot--primary {
        background: var(--app-color-primary);
      }

      .legend-dot--track {
        background: var(--app-color-surface-strong);
        border: 1px solid var(--app-color-border);
      }
    `,
  ],
})
export class SpendingChartComponent {
  @Input() income = 0;
  @Input() outcome = 0;

  protected readonly circumference = 2 * Math.PI * 38;

  protected get ratio(): number {
    return this.income > 0 ? Math.min(this.outcome / this.income, 1) : 0;
  }

  protected get percentage(): string {
    return `${Math.round(this.ratio * 100)}%`;
  }

  protected get dashOffset(): number {
    return this.circumference * (1 - this.ratio);
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
  }
}
