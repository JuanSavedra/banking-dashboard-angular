import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
})
export class LoadingStateComponent {
  @Input() label = 'Carregando informações';
  @Input() rows = 3;

  protected get skeletonRows(): number[] {
    return Array.from({ length: this.rows }, (_, index) => index);
  }
}
