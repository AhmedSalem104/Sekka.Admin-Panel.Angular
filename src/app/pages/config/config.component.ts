import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  activeTab = 'settings';
  loading = signal(true);

  // Settings
  settings = signal<any[]>([]);

  // Feature Flags
  featureFlags = signal<any[]>([]);

  // App Versions
  appVersions = signal<any[]>([]);

  // Maintenance
  maintenance = signal<any>(null);

  // Commissions
  commissions = signal<any[]>([]);

  // Create setting modal
  showCreateSetting = signal(false);
  newSetting = { key: '', value: '', type: 'string', category: 'general', description: '' };

  // Create feature flag modal
  showCreateFlag = signal(false);
  newFlag = { key: '', isEnabled: false, description: '', rolloutPercentage: 0 };

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    this.http.get<any>(`${this.apiUrl}/config/settings`).subscribe({
      next: (res) => { if (res.isSuccess) this.settings.set(res.data || []); }
    });
    this.http.get<any>(`${this.apiUrl}/config/feature-flags`).subscribe({
      next: (res) => { if (res.isSuccess) this.featureFlags.set(res.data || []); }
    });
    this.http.get<any>(`${this.apiUrl}/config/versions`).subscribe({
      next: (res) => { if (res.isSuccess) this.appVersions.set(res.data || []); }
    });
    this.http.get<any>(`${this.apiUrl}/config/maintenance`).subscribe({
      next: (res) => { if (res.isSuccess) this.maintenance.set(res.data); }
    });
    this.http.get<any>(`${this.apiUrl}/config/commissions`).subscribe({
      next: (res) => {
        if (res.isSuccess) this.commissions.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Settings CRUD
  editSetting(s: any) {
    const newVal = prompt('القيمة الجديدة:', s.value);
    if (newVal !== null && newVal !== s.value) {
      this.updateSetting(s.key, newVal);
    }
  }

  updateSetting(key: string, value: string) {
    this.http.put<any>(`${this.apiUrl}/config/settings/${key}`, { value }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  createSetting() {
    this.http.post<any>(`${this.apiUrl}/config/settings`, this.newSetting).subscribe({
      next: (res) => { if (res.isSuccess) { this.showCreateSetting.set(false); this.loadAll(); } }
    });
  }

  deleteSetting(key: string) {
    if (!confirm('حذف الإعداد؟')) return;
    this.http.delete<any>(`${this.apiUrl}/config/settings/${key}`).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  // Feature Flags
  toggleFlag(key: string) {
    this.http.put<any>(`${this.apiUrl}/config/feature-flags/${key}/toggle`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  createFlag() {
    this.http.post<any>(`${this.apiUrl}/config/feature-flags`, this.newFlag).subscribe({
      next: (res) => { if (res.isSuccess) { this.showCreateFlag.set(false); this.loadAll(); } }
    });
  }

  deleteFlag(key: string) {
    if (!confirm('حذف الميزة؟')) return;
    this.http.delete<any>(`${this.apiUrl}/config/feature-flags/${key}`).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  // Maintenance
  enableMaintenance() {
    const msg = prompt('رسالة الصيانة بالعربي:');
    if (!msg) return;
    this.http.post<any>(`${this.apiUrl}/config/maintenance/enable`, {
      message: 'System maintenance', messageAr: msg
    }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  disableMaintenance() {
    this.http.post<any>(`${this.apiUrl}/config/maintenance/disable`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  // Commissions
  toggleCommission(id: number) {
    this.http.put<any>(`${this.apiUrl}/config/commissions/${id}/toggle`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadAll(); }
    });
  }

  getCategories(): string[] {
    const cats = new Set(this.settings().map((s: any) => s.category));
    return Array.from(cats);
  }

  getSettingsByCategory(cat: string): any[] {
    return this.settings().filter((s: any) => s.category === cat);
  }
}
