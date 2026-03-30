import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-savings-circles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './savings-circles.component.html',
  styleUrl: './savings-circles.component.scss'
})
export class SavingsCirclesComponent implements OnInit {
  private http = inject(HttpClient);
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  showDetail = signal(false);
  selectedCircle = signal<any>(null);
  stats = signal<any>(null);

  readonly statusMap: Record<number, string> = {
    0: 'قيد الانتظار',
    1: 'نشطة',
    2: 'معلّقة',
    3: 'مكتملة',
    4: 'مغلقة'
  };

  readonly statusBadgeMap: Record<number, string> = {
    0: 'badge-pending',
    1: 'badge-active',
    2: 'badge-warning',
    3: 'badge-success',
    4: 'badge-inactive'
  };

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `/api/v1/admin/savings-circles?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&status=${this.statusFilter}`;

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

  loadStats() {
    this.http.get<any>('/api/v1/admin/savings-circles/stats').subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.stats.set(res.data);
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

  viewCircle(id: string) {
    this.http.get<any>(`/api/v1/admin/savings-circles/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedCircle.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  suspendCircle(id: string) {
    const reason = prompt('سبب التعليق:');
    if (!reason) return;
    this.http.put<any>(`/api/v1/admin/savings-circles/${id}/suspend`, { reason }).subscribe({
      next: () => { this.loadData(); this.showDetail.set(false); }
    });
  }

  resumeCircle(id: string) {
    this.http.put<any>(`/api/v1/admin/savings-circles/${id}/resume`, {}).subscribe({
      next: () => { this.loadData(); this.showDetail.set(false); }
    });
  }

  closeCircle(id: string) {
    const reason = prompt('سبب الإغلاق:');
    if (!reason) return;
    this.http.put<any>(`/api/v1/admin/savings-circles/${id}/close`, { reason }).subscribe({
      next: () => { this.loadData(); this.showDetail.set(false); }
    });
  }

  forcePayout(id: string) {
    const reason = prompt('سبب الدفع القسري:');
    if (!reason) return;
    this.http.post<any>(`/api/v1/admin/savings-circles/${id}/force-payout`, { reason }).subscribe({
      next: () => { this.loadData(); this.showDetail.set(false); }
    });
  }

  getStatusLabel(status: number): string {
    return this.statusMap[status] || '—';
  }

  getStatusBadge(status: number): string {
    return this.statusBadgeMap[status] || 'badge-inactive';
  }
}
