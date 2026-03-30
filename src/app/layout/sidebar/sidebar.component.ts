import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private router = inject(Router);

  collapsed = signal(false);
  mobileOpen = signal(false);
  expandedGroup = signal<string | null>(null);

  navGroups: NavGroup[] = [
    {
      title: 'الرئيسية',
      items: [
        { label: 'لوحة التحكم', icon: '📊', route: '/dashboard' },
        { label: 'الإحصائيات', icon: '📈', route: '/statistics' },
        { label: 'التقارير الذكية', icon: '🧠', route: '/insights' },
      ]
    },
    {
      title: 'العمليات',
      items: [
        { label: 'الطلبات', icon: '📦', route: '/orders' },
        { label: 'السائقين', icon: '🚗', route: '/drivers' },
        { label: 'الفترات الزمنية', icon: '🕐', route: '/time-slots' },
      ]
    },
    {
      title: 'المستخدمين',
      items: [
        { label: 'العملاء', icon: '👥', route: '/customers' },
        { label: 'الشركاء', icon: '🏪', route: '/partners' },
        { label: 'القائمة السوداء', icon: '🚫', route: '/blacklist' },
      ]
    },
    {
      title: 'المالية',
      items: [
        { label: 'الاشتراكات', icon: '💎', route: '/subscriptions' },
        { label: 'التسويات', icon: '💰', route: '/settlements' },
        { label: 'المدفوعات', icon: '💳', route: '/payments' },
        { label: 'المحافظ', icon: '👛', route: '/wallets' },
        { label: 'الفواتير', icon: '🧾', route: '/invoices' },
        { label: 'الاستردادات', icon: '↩️', route: '/refunds' },
        { label: 'النزاعات', icon: '⚖️', route: '/disputes' },
      ]
    },
    {
      title: 'المنصة',
      items: [
        { label: 'المركبات', icon: '🏍️', route: '/vehicles' },
        { label: 'المناطق', icon: '📍', route: '/regions' },
        { label: 'الإعدادات', icon: '⚙️', route: '/config' },
        { label: 'الأدوار', icon: '🔐', route: '/roles' },
        { label: 'الإشعارات', icon: '🔔', route: '/notifications' },
        { label: 'الطوارئ SOS', icon: '🆘', route: '/sos' },
      ]
    },
    {
      title: 'التسويق',
      items: [
        { label: 'الشرائح', icon: '🎯', route: '/segments' },
        { label: 'الحملات', icon: '📢', route: '/campaigns' },
        { label: 'دوائر التوفير', icon: '🔄', route: '/savings-circles' },
      ]
    },
    {
      title: 'النظام',
      items: [
        { label: 'سجل المراجعة', icon: '📋', route: '/audit-logs' },
      ]
    }
  ];

  toggleCollapse() {
    this.collapsed.update(v => !v);
  }

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
