import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
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

  // Detail
  showDetail = signal(false);
  selectedOrder = signal<any>(null);
  timeline = signal<any[]>([]);

  // Override status
  showOverride = signal(false);
  overrideOrderId = '';
  overrideStatus = '';
  overrideReason = '';

  // Assign
  showAssign = signal(false);
  assignOrderId = '';
  assignDriverId = '';

  // Suggested drivers
  suggestedDrivers = signal<any[]>([]);
  showSuggested = signal(false);

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/orders?pageNumber=${this.currentPage}&pageSize=10`;
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

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  getStatusBadge(status: number): string {
    const map: Record<number, string> = {
      0: 'badge-pending', 1: 'badge-info', 2: 'badge-info',
      3: 'badge-in-transit', 4: 'badge-arrived', 5: 'badge-delivered',
      6: 'badge-cancelled', 7: 'badge-returned'
    };
    return map[status] || 'badge-inactive';
  }

  getStatusLabel(status: number): string {
    const map: Record<number, string> = {
      0: 'قيد الانتظار',
      1: 'مقبول',
      2: 'تم الاستلام',
      3: 'في الطريق',
      4: 'وصل',
      5: 'تم التسليم',
      6: 'ملغي',
      7: 'مرتجع'
    };
    return map[status] || `${status}`;
  }

  viewOrder(id: string) {
    this.showDetail.set(true);
    this.selectedOrder.set(null);
    this.timeline.set([]);
    this.http.get<any>(`${this.apiUrl}/orders/${id}/timeline`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedOrder.set(res.data);
          this.timeline.set(res.data.events || []);
        }
      }
    });
  }

  openAssign(orderId: string) {
    this.assignOrderId = orderId;
    this.assignDriverId = '';
    this.showAssign.set(true);
  }

  assignDriver() {
    this.http.post<any>(`${this.apiUrl}/orders/${this.assignOrderId}/assign`, {
      driverId: this.assignDriverId
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.showAssign.set(false); this.loadData(); }
      }
    });
  }

  autoAssign(orderId: string) {
    this.http.post<any>(`${this.apiUrl}/orders/${orderId}/auto-assign`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) this.loadData();
      }
    });
  }

  openOverride(orderId: string) {
    this.overrideOrderId = orderId;
    this.overrideStatus = '';
    this.overrideReason = '';
    this.showOverride.set(true);
  }

  submitOverride() {
    this.http.put<any>(`${this.apiUrl}/orders/${this.overrideOrderId}/override-status`, {
      newStatus: parseInt(this.overrideStatus),
      reason: this.overrideReason
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.showOverride.set(false); this.loadData(); }
      }
    });
  }

  autoDistribute() {
    this.http.post<any>(`${this.apiUrl}/orders/auto-distribute`, {
      maxOrdersPerDriver: 5
    }).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  viewSuggestedDrivers(orderId: string) {
    this.http.get<any>(`${this.apiUrl}/orders/${orderId}/suggested-drivers`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.suggestedDrivers.set(res.data || []);
          this.showSuggested.set(true);
        }
      }
    });
  }

  exportOrders() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = now.toISOString();
    window.open(`${this.apiUrl}/orders/export?from=${from}&to=${to}&format=csv`, '_blank');
  }
}
