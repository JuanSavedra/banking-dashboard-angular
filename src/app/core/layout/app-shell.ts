import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { logout } from '../store/auth/auth.actions';
import { selectUser } from '../store/auth/auth.selectors';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly store = inject(Store);

  protected readonly productName = 'Banking Dashboard';
  protected readonly menuOpen = signal(false);
  protected readonly compactLayout = toSignal(
    this.breakpointObserver.observe('(max-width: 48rem)').pipe(map((state) => state.matches)),
    { initialValue: false },
  );
  protected readonly sidebarHiddenFromKeyboard = computed(
    () => this.compactLayout() && !this.menuOpen(),
  );
  protected readonly user = toSignal(this.store.select(selectUser));

  protected readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
    { label: 'Extrato', icon: 'receipt_long', route: '/app/transactions' },
    { label: 'Transferência', icon: 'swap_horiz', route: '/app/transfers' },
    { label: 'Favorecidos', icon: 'groups', route: '/app/beneficiaries' },
    { label: 'Cartões', icon: 'credit_card', route: '/app/cards' },
    { label: 'Perfil', icon: 'person', route: '/app/profile' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected logout(): void {
    this.store.dispatch(logout());
  }
}
