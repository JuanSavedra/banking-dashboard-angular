import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../services/auth';

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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly productName = 'Banking Dashboard';
  protected readonly phase = 'Fase 3 - Rotas, navegação e autenticação';
  protected readonly menuOpen = signal(false);
  protected readonly user = computed(() => this.authService.user());

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
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
