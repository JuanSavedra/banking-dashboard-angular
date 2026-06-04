import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
