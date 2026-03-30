import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  showDetail = signal(false);
  selectedCustomer = signal<any>(null);
  customerStats = signal<any>(null);
  search = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/customers?pageNumber=${this.currentPage}&pageSize=10`;
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

  viewCustomer(id: string) {
    this.http.get<any>(`${this.apiUrl}/customers/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedCustomer.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  activateCustomer(id: string) {
    this.http.post<any>(`${this.apiUrl}/customers/${id}/unblock`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.selectedCustomer()?.id === id) {
            this.viewCustomer(id);
          }
        }
      }
    });
  }

  deactivateCustomer(id: string) {
    this.http.post<any>(`${this.apiUrl}/customers/${id}/block`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.selectedCustomer()?.id === id) {
            this.viewCustomer(id);
          }
        }
      }
    });
  }

  loadStats() {
    this.http.get<any>(`${this.apiUrl}/customers/stats`).subscribe({
      next: (res) => { if (res.isSuccess) this.customerStats.set(res.data); }
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

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'Active': 'badge-active',
      'Inactive': 'badge-inactive',
      'Blocked': 'badge-error'
    };
    return map[status] || 'badge-inactive';
  }
}
