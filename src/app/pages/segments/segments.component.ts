import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-segments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './segments.component.html',
  styleUrl: './segments.component.scss'
})
export class SegmentsComponent implements OnInit {
  private http = inject(HttpClient);
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  typeFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  showDetail = signal(false);
  selectedSegment = signal<any>(null);

  showCreate = signal(false);
  newSegment = { name: '', description: '', type: 'driver', isDynamic: false, rules: '' };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    let url = `/api/v1/admin/segments?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
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

  onSearch() {
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  viewSegment(id: string) {
    this.http.get<any>(`/api/v1/admin/segments/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedSegment.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  createSegment() {
    const body: any = {
      name: this.newSegment.name,
      description: this.newSegment.description,
      type: this.newSegment.type,
      isDynamic: this.newSegment.isDynamic,
    };
    if (this.newSegment.rules) {
      try { body.rules = JSON.parse(this.newSegment.rules); } catch { body.rules = null; }
    }
    this.http.post<any>('/api/v1/admin/segments', body).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showCreate.set(false);
          this.newSegment = { name: '', description: '', type: 'driver', isDynamic: false, rules: '' };
          this.loadData();
        }
      }
    });
  }

  deleteSegment(id: string) {
    if (!confirm('متأكد إنك عايز تحذف الشريحة دي؟')) return;
    this.http.delete<any>(`/api/v1/admin/segments/${id}`).subscribe({
      next: () => this.loadData()
    });
  }

  toggleSegment(id: string) {
    this.http.put<any>(`/api/v1/admin/segments/${id}/toggle`, {}).subscribe({
      next: () => this.loadData()
    });
  }

  refreshSegment(id: string) {
    this.http.post<any>(`/api/v1/admin/segments/${id}/refresh`, {}).subscribe({
      next: () => this.loadData()
    });
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { driver: 'سائق', customer: 'عميل', partner: 'شريك' };
    return map[type] || type || '—';
  }
}
