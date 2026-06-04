import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorStateComponent {
  @Input() title = 'Não foi possível carregar';
  @Input() description = 'Tente novamente em alguns instantes.';
  @Input() actionLabel = 'Tentar novamente';
  @Output() action = new EventEmitter<void>();
}
