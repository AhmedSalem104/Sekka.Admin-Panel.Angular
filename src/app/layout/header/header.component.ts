import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);

  @Output() menuToggle = new EventEmitter<void>();

  isDark = signal(localStorage.getItem('theme') === 'dark');
  profileOpen = signal(false);

  adminName = 'مدير النظام';

  toggleTheme() {
    this.isDark.update(v => !v);
    const theme = this.isDark() ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', this.isDark());
  }

  toggleProfile() {
    this.profileOpen.update(v => !v);
  }

  logout() {
    localStorage.removeItem('sekka_token');
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    }
  }
}
