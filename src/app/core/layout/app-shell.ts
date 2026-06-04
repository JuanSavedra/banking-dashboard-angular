import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { logout } from '../store/auth/auth.actions';
import { selectUser } from '../store/auth/auth.selectors';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShellComponent {
  private readonly store = inject(Store);

  protected readonly productName = 'Banking Dashboard';
  protected readonly menuOpen = signal(false);
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
