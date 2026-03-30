import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
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

  stats = signal<any>(null);
  showDetail = signal(false);
  selectedSub = signal<any>(null);

  // Extend modal
  showExtend = signal(false);
  extendId = '';
  extendDays = 30;
  extendReason = '';

  // Gift modal
  showGift = signal(false);
  giftDriverId = '';
  giftPlanId = 1;
  giftDays = 30;
  giftReason = '';

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/subscriptions?pageNumber=${this.currentPage}&pageSize=10`;
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
    this.http.get<any>(`${this.apiUrl}/subscriptions/stats`).subscribe({
      next: (res) => { if (res.isSuccess) this.stats.set(res.data); }
    });
  }

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  getStatusBadge(status: number): string {
    const map: Record<number, string> = { 0: 'badge-pending', 1: 'badge-active', 2: 'badge-error', 3: 'badge-cancelled' };
    return map[status] || 'badge-inactive';
  }

  viewSubscription(id: string) {
    this.showDetail.set(true);
    this.selectedSub.set(null);
    this.http.get<any>(`${this.apiUrl}/subscriptions/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedSub.set(res.data); }
    });
  }

  openExtend(id: string) {
    this.extendId = id;
    this.extendDays = 30;
    this.extendReason = '';
    this.showExtend.set(true);
  }

  submitExtend() {
    this.http.put<any>(`${this.apiUrl}/subscriptions/${this.extendId}/extend`, {
      days: this.extendDays, reason: this.extendReason
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.showExtend.set(false); this.loadData(); } }
    });
  }

  cancelSubscription(id: string) {
    const reason = prompt('سبب الإلغاء:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/subscriptions/${id}/cancel`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  submitGift() {
    this.http.post<any>(`${this.apiUrl}/subscriptions/gift`, {
      driverId: this.giftDriverId, planId: this.giftPlanId,
      durationDays: this.giftDays, reason: this.giftReason
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.showGift.set(false); this.loadData(); this.loadStats(); } }
    });
  }
}
