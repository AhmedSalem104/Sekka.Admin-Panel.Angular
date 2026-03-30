import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settlements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settlements.component.html',
  styleUrl: './settlements.component.scss'
})
export class SettlementsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  typeFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  summary = signal<any>(null);

  showDetail = signal(false);
  selectedSettlement = signal<any>(null);

  // Process payment modal
  showProcess = signal(false);
  processId = '';
  paymentMethod = 'BankTransfer';
  transactionRef = '';

  ngOnInit() { this.loadData(); this.loadSummary(); }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/settlements?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&status=${this.statusFilter}`;
    if (this.typeFilter) url += `&type=${this.typeFilter}`;

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

  loadSummary() {
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const toDate = now.toISOString();
    this.http.get<any>(`${this.apiUrl}/settlements/summary?fromDate=${fromDate}&toDate=${toDate}`).subscribe({
      next: (res) => { if (res.isSuccess) this.summary.set(res.data); }
    });
  }

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  getStatusBadge(status: number): string {
    const map: Record<number, string> = { 0: 'badge-draft', 1: 'badge-pending', 2: 'badge-active', 3: 'badge-success', 4: 'badge-error' };
    return map[status] || 'badge-inactive';
  }

  viewSettlement(id: string) {
    this.showDetail.set(true);
    this.selectedSettlement.set(null);
    this.http.get<any>(`${this.apiUrl}/settlements/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedSettlement.set(res.data); }
    });
  }

  approveSettlement(id: string) {
    const notes = prompt('ملاحظات الموافقة:') || '';
    this.http.put<any>(`${this.apiUrl}/settlements/${id}/approve`, { notes }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  rejectSettlement(id: string) {
    const reason = prompt('سبب الرفض:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/settlements/${id}/reject`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  openProcess(id: string) {
    this.processId = id;
    this.paymentMethod = 'BankTransfer';
    this.transactionRef = '';
    this.showProcess.set(true);
  }

  submitProcess() {
    this.http.post<any>(`${this.apiUrl}/settlements/${this.processId}/process`, {
      paymentMethod: this.paymentMethod,
      transactionReference: this.transactionRef
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.showProcess.set(false); this.loadData(); } }
    });
  }
}
