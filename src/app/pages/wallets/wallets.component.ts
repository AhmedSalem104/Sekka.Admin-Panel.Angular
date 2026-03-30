import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.scss'
})
export class WalletsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  ownerTypeFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  // Stats
  stats = signal<any>(null);
  frozenWallets = signal<any[]>([]);
  highBalance = signal<any[]>([]);

  // Detail
  showDetail = signal(false);
  selectedWallet = signal<any>(null);

  // Bulk adjust
  showBulkAdjust = signal(false);
  bulkAdjustData = { driverIds: '', amount: 0, type: 'Credit', reason: '' };

  // Adjust balance
  showAdjust = signal(false);
  adjustWalletId = '';
  adjustAmount = 0;
  adjustType = 'Credit';
  adjustReason = '';

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/wallets?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.ownerTypeFilter) url += `&ownerType=${this.ownerTypeFilter}`;

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
    this.http.get<any>(`${this.apiUrl}/wallets/stats`).subscribe({
      next: (res) => { if (res.isSuccess) this.stats.set(res.data); }
    });
  }

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  viewWallet(id: string) {
    this.showDetail.set(true);
    this.selectedWallet.set(null);
    this.http.get<any>(`${this.apiUrl}/wallets/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedWallet.set(res.data); }
    });
  }

  openAdjust(walletId: string) {
    this.adjustWalletId = walletId;
    this.adjustAmount = 0;
    this.adjustType = 'Credit';
    this.adjustReason = '';
    this.showAdjust.set(true);
  }

  submitAdjust() {
    this.http.post<any>(`${this.apiUrl}/wallets/${this.adjustWalletId}/adjust`, {
      amount: this.adjustAmount,
      type: this.adjustType,
      reason: this.adjustReason
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.showAdjust.set(false); this.loadData(); this.loadStats(); }
      }
    });
  }

  freezeWallet(id: string) {
    const reason = prompt('سبب التجميد:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/wallets/${id}/freeze`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  unfreezeWallet(id: string) {
    const reason = prompt('سبب إلغاء التجميد:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/wallets/${id}/unfreeze`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  loadFrozen() {
    this.http.get<any>(`${this.apiUrl}/wallets/frozen`).subscribe({
      next: (res) => { if (res.isSuccess) this.frozenWallets.set(res.data); }
    });
  }

  loadHighBalance() {
    this.http.get<any>(`${this.apiUrl}/wallets/high-balance?threshold=5000`).subscribe({
      next: (res) => { if (res.isSuccess) this.highBalance.set(res.data); }
    });
  }

  viewTransactions(driverId: string) {
    return this.http.get<any>(`${this.apiUrl}/wallets/driver/${driverId}/transactions?pageNumber=1&pageSize=20`);
  }

  bulkAdjust() {
    this.showBulkAdjust.set(true);
  }

  submitBulkAdjust() {
    const driverIds = this.bulkAdjustData.driverIds.split(',').map(id => id.trim()).filter(id => id);
    this.http.post<any>(`${this.apiUrl}/wallets/bulk-adjust`, {
      driverIds,
      amount: this.bulkAdjustData.amount,
      type: this.bulkAdjustData.type,
      reason: this.bulkAdjustData.reason
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.showBulkAdjust.set(false); this.loadData(); this.loadStats(); }
      }
    });
  }

  exportWallets() {
    window.open(`${this.apiUrl}/wallets/export?format=csv`, '_blank');
  }
}
