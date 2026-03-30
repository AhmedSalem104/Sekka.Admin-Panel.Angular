import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sos.component.html',
  styleUrl: './sos.component.scss'
})
export class SosComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  showDetail = signal(false);
  selectedSos = signal<any>(null);
  activeCount = signal<any>(null);
  search = '';
  statusFilter = '';
  priorityFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  ngOnInit() {
    this.loadData();
    this.loadActiveCount();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/sos?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&status=${this.statusFilter}`;
    if (this.priorityFilter) url += `&priority=${this.priorityFilter}`;

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

  loadActiveCount() {
    this.http.get<any>(`${this.apiUrl}/sos/active-count`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.activeCount.set(res.data);
        }
      }
    });
  }

  viewSos(id: string) {
    this.http.get<any>(`${this.apiUrl}/sos/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedSos.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  acknowledgeSos(id: string) {
    this.http.put<any>(`${this.apiUrl}/sos/${id}/acknowledge`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          this.loadActiveCount();
          if (this.selectedSos()?.id === id) {
            this.viewSos(id);
          }
        }
      }
    });
  }

  resolveSos(id: string) {
    const resolution = prompt('أدخل قرار الحل:');
    if (!resolution) return;
    const notes = prompt('ملاحظات إضافية (اختياري):') || '';
    this.http.put<any>(`${this.apiUrl}/sos/${id}/resolve`, {
      resolution,
      notes
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          this.loadActiveCount();
          if (this.selectedSos()?.id === id) {
            this.viewSos(id);
          }
        }
      }
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

  getPriorityBadge(priority: string): string {
    const map: Record<string, string> = {
      'Critical': 'badge-error',
      'High': 'badge-warning',
      'Medium': 'badge-in-transit',
      'Low': 'badge-info'
    };
    return map[priority] || 'badge-inactive';
  }

  getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
      'Critical': 'حرج',
      'High': 'عالي',
      'Medium': 'متوسط',
      'Low': 'منخفض'
    };
    return map[priority] || priority;
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'Active': 'badge-error',
      'Acknowledged': 'badge-warning',
      'Resolved': 'badge-success',
      'Closed': 'badge-inactive'
    };
    return map[status] || 'badge-inactive';
  }
}
