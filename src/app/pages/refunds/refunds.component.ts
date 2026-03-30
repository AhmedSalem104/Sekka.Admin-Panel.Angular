import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './refunds.component.html',
  styleUrl: './refunds.component.scss'
})
export class RefundsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  showDetail = signal(false);
  selectedRefund = signal<any>(null);
  stats = signal<any>(null);

  // Approve modal
  showApprove = signal(false);
  approveId = '';
  approveAmount = 0;
  approveMethod = 'Wallet';
  approveNotes = '';

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/refunds?pageNumber=${this.currentPage}&pageSize=10`;
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
    this.http.get<any>(`${this.apiUrl}/refunds/stats`).subscribe({
      next: (res) => { if (res.isSuccess) this.stats.set(res.data); }
    });
  }

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  getStatusBadge(status: number): string {
    const map: Record<number, string> = { 0: 'badge-pending', 1: 'badge-active', 2: 'badge-success', 3: 'badge-error' };
    return map[status] || 'badge-inactive';
  }

  viewRefund(id: string) {
    this.showDetail.set(true);
    this.selectedRefund.set(null);
    this.http.get<any>(`${this.apiUrl}/refunds/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedRefund.set(res.data); }
    });
  }

  openApprove(item: any) {
    this.approveId = item.id;
    this.approveAmount = item.amount;
    this.approveMethod = 'Wallet';
    this.approveNotes = '';
    this.showApprove.set(true);
  }

  submitApprove() {
    this.http.put<any>(`${this.apiUrl}/refunds/${this.approveId}/approve`, {
      amount: this.approveAmount, refundMethod: this.approveMethod, notes: this.approveNotes
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.showApprove.set(false); this.loadData(); this.loadStats(); } }
    });
  }

  rejectRefund(id: string) {
    const reason = prompt('سبب الرفض:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/refunds/${id}/reject`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  processRefund(id: string) {
    this.http.post<any>(`${this.apiUrl}/refunds/${id}/process`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  exportRefunds() {
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const toDate = now.toISOString();
    window.open(`${this.apiUrl}/refunds/export?format=csv&fromDate=${fromDate}&toDate=${toDate}`, '_blank');
  }
}
