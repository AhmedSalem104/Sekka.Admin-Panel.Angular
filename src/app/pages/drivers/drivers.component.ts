import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  onlineFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  // Detail & Performance
  showDetail = signal(false);
  selectedDriver = signal<any>(null);
  detailLoading = signal(false);
  showPerformance = signal(false);
  performance = signal<any>(null);

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/drivers?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&status=${this.statusFilter}`;
    if (this.onlineFilter) url += `&isOnline=${this.onlineFilter}`;

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

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  getStatusBadge(status: number): string {
    const map: Record<number, string> = { 1: 'badge-active', 0: 'badge-inactive', 2: 'badge-warning', 3: 'badge-error' };
    return map[status] || 'badge-inactive';
  }

  getStatusName(status: number): string {
    const map: Record<number, string> = { 1: 'نشط', 0: 'غير نشط', 2: 'موقوف', 3: 'محظور' };
    return map[status] || '—';
  }

  viewDriver(id: string) {
    this.detailLoading.set(true);
    this.showDetail.set(true);
    this.http.get<any>(`${this.apiUrl}/drivers/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) this.selectedDriver.set(res.data);
        this.detailLoading.set(false);
      },
      error: () => this.detailLoading.set(false)
    });
  }

  viewPerformance(id: string) {
    this.showPerformance.set(true);
    this.http.get<any>(`${this.apiUrl}/drivers/${id}/performance`).subscribe({
      next: (res) => {
        if (res.isSuccess) this.performance.set(res.data);
      }
    });
  }

  Math = Math;

  toggleDriverStatus(driver: any) {
    const action = driver.status === 1 ? 'deactivate' : 'activate';
    this.http.put<any>(`${this.apiUrl}/drivers/${driver.id}/${action}`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) this.loadData();
      }
    });
  }
}
