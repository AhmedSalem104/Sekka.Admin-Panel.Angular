import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  categoryFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  showDetail = signal(false);
  selectedPartner = signal<any>(null);

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/partners?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&verificationStatus=${this.statusFilter}`;
    if (this.categoryFilter) url += `&categoryId=${this.categoryFilter}`;

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

  getVerificationBadge(status: number): string {
    const map: Record<number, string> = { 0: 'badge-pending', 1: 'badge-info', 2: 'badge-success', 3: 'badge-error' };
    return map[status] || 'badge-inactive';
  }

  viewPartner(id: string) {
    this.showDetail.set(true);
    this.selectedPartner.set(null);
    this.http.get<any>(`${this.apiUrl}/partners/${id}`).subscribe({
      next: (res) => { if (res.isSuccess) this.selectedPartner.set(res.data); }
    });
  }

  activatePartner(id: string) {
    this.http.put<any>(`${this.apiUrl}/partners/${id}/activate`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  deactivatePartner(id: string) {
    this.http.put<any>(`${this.apiUrl}/partners/${id}/deactivate`, {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  verifyPartner(id: string) {
    const notes = prompt('ملاحظات التحقق:');
    if (notes === null) return;
    this.http.put<any>(`${this.apiUrl}/partners/${id}/verify`, { notes }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  rejectPartner(id: string) {
    const reason = prompt('سبب الرفض:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/partners/${id}/reject`, { reason }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  updateCommission(id: string) {
    const rate = prompt('نسبة العمولة الجديدة:');
    if (!rate) return;
    const reason = prompt('سبب التغيير:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/partners/${id}/commission`, {
      commissionRate: parseFloat(rate), reason
    }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }
}
