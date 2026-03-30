import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  get sidebarCollapsed(): boolean {
    return this.sidebar?.collapsed() ?? false;
  }

  onMenuToggle() {
    this.sidebar.toggleMobile();
  }
}
