import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() eyebrow = '';
}
