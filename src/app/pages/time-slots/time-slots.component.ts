import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-slots.component.html',
  styleUrl: './time-slots.component.scss'
})
export class TimeSlotsComponent implements OnInit {
  private http = inject(HttpClient);
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  regionFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  showCreate = signal(false);
  newSlot = { name: '', startTime: '', endTime: '', maxOrders: 0, surchargePercent: 0, regionId: '', isActive: true };

  slotStats = signal<any>(null);

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `/api/v1/admin/time-slots?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.regionFilter) url += `&region=${this.regionFilter}`;

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

  createTimeSlot() {
    this.http.post<any>('/api/v1/admin/time-slots', this.newSlot).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showCreate.set(false);
          this.newSlot = { name: '', startTime: '', endTime: '', maxOrders: 0, surchargePercent: 0, regionId: '', isActive: true };
          this.loadData();
        }
      }
    });
  }

  toggleTimeSlot(id: string) {
    this.http.put<any>(`/api/v1/admin/time-slots/${id}/toggle`, {}).subscribe({
      next: () => this.loadData()
    });
  }

  deleteTimeSlot(id: string) {
    if (!confirm('متأكد إنك عايز تحذف الفترة دي؟')) return;
    this.http.delete<any>(`/api/v1/admin/time-slots/${id}`).subscribe({
      next: () => this.loadData()
    });
  }

  generateWeek() {
    this.http.post<any>('/api/v1/admin/time-slots/generate-week', {}).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); }
    });
  }

  loadStats() {
    this.http.get<any>('/api/v1/admin/time-slots/stats').subscribe({
      next: (res) => { if (res.isSuccess) this.slotStats.set(res.data); }
    });
  }

  getCapacityColor(used: number, total: number): string {
    const ratio = total > 0 ? used / total : 0;
    if (ratio > 0.9) return 'var(--error)';
    if (ratio > 0.7) return 'var(--warning)';
    return 'var(--success)';
  }
}
