import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss'
})
export class RegionsComponent implements OnInit {
  private http = inject(HttpClient);
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  showCreate = signal(false);
  newRegion = { name: '', nameEn: '', deliveryFeeMultiplier: 1.0 };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    let url = `/api/v1/admin/regions?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const data = res.data;
          // Handle both paginated and array responses
          if (Array.isArray(data)) {
            this.items.set(data);
            this.totalPages = 1;
            this.totalCount = data.length;
          } else {
            this.items.set(data.items || []);
            this.totalPages = data.totalPages || 1;
            this.totalCount = data.totalCount || 0;
          }
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

  createRegion() {
    this.http.post<any>('/api/v1/admin/regions', this.newRegion).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showCreate.set(false);
          this.newRegion = { name: '', nameEn: '', deliveryFeeMultiplier: 1.0 };
          this.loadData();
        }
      }
    });
  }

  deleteRegion(id: string) {
    if (!confirm('متأكد إنك عايز تحذف المنطقة دي؟')) return;
    this.http.delete<any>(`/api/v1/admin/regions/${id}`).subscribe({
      next: () => this.loadData()
    });
  }
}
