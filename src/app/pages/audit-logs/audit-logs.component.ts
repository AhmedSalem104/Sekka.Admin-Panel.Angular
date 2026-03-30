import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  actionFilter = '';
  entityTypeFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  availableActions = signal<string[]>([]);
  showDetail = signal(false);
  selectedLog = signal<any>(null);

  ngOnInit() {
    this.loadData();
    this.loadActions();
  }

  loadActions() {
    this.http.get<any>(`${this.apiUrl}/audit-logs/actions`).subscribe({
      next: (res) => { if (res.isSuccess) this.availableActions.set(res.data || []); }
    });
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/audit-logs?pageNumber=${this.currentPage}&pageSize=20`;
    if (this.search) url += `&search=${this.search}`;
    if (this.actionFilter) url += `&action=${this.actionFilter}`;
    if (this.entityTypeFilter) url += `&entityType=${this.entityTypeFilter}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.items.set(res.data.items || []);
          this.totalPages = res.data.totalPages || 1;
          this.totalCount = res.data.totalCount || 0;
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  getActionBadge(action: string): string {
    if (action.includes('Activated') || action.includes('Created') || action.includes('Approved')) return 'badge-success';
    if (action.includes('Deactivated') || action.includes('Deleted') || action.includes('Rejected')) return 'badge-error';
    if (action.includes('Updated') || action.includes('Toggled')) return 'badge-info';
    if (action.includes('Frozen') || action.includes('Suspended')) return 'badge-warning';
    return 'badge-inactive';
  }

  viewLog(id: string) {
    this.showDetail.set(true);
    this.selectedLog.set(null);
    this.http.get<any>(`${this.apiUrl}/audit-logs/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedLog.set(res.data); }
    });
  }

  exportLogs() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = now.toISOString();
    window.open(`${this.apiUrl}/audit-logs/export?from=${from}&to=${to}&format=csv`, '_blank');
  }
}
