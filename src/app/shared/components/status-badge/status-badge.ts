import { Component, Input } from '@angular/core';

export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadgeComponent {
  @Input() label = '';
  @Input() variant: StatusBadgeVariant = 'neutral';
}
