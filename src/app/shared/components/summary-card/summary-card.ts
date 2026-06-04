import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type SummaryCardTone = 'positive' | 'negative' | 'neutral';

@Component({
  selector: 'app-summary-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() tone: SummaryCardTone = 'neutral';
}
