import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  methodFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  showDetail = signal(false);
  selectedPayment = signal<any>(null);

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/payments?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&status=${this.statusFilter}`;
    if (this.methodFilter) url += `&method=${this.methodFilter}`;

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

  getStatusBadge(status: number): string {
    const map: Record<number, string> = { 0: 'badge-pending', 1: 'badge-processing', 2: 'badge-success', 3: 'badge-error', 4: 'badge-cancelled', 5: 'badge-returned' };
    return map[status] || 'badge-inactive';
  }

  viewPayment(id: string) {
    this.showDetail.set(true);
    this.selectedPayment.set(null);
    this.http.get<any>(`${this.apiUrl}/payments/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedPayment.set(res.data); }
    });
  }

  retryPayment(id: string) {
    this.http.post<any>(`${this.apiUrl}/payments/${id}/retry`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  voidPayment(id: string) {
    const reason = prompt('سبب الإلغاء:');
    if (!reason) return;
    this.http.post<any>(`${this.apiUrl}/payments/${id}/void`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  exportPayments() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = now.toISOString();
    window.open(`${this.apiUrl}/payments/export?from=${from}&to=${to}&format=csv`, '_blank');
  }
}
