import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blacklist.component.html',
  styleUrl: './blacklist.component.scss'
})
export class BlacklistComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  showAdd = signal(false);
  newEntry = { userId: '', userType: 'driver', reason: '', expiresAt: '' };
  search = '';
  typeFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/blacklist?pageNumber=${this.currentPage}&pageSize=10`;
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

  addToBlacklist() {
    this.http.post<any>(`${this.apiUrl}/blacklist`, this.newEntry).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showAdd.set(false);
          this.newEntry = { userId: '', userType: 'driver', reason: '', expiresAt: '' };
          this.loadData();
        }
      }
    });
  }

  removeFromBlacklist(id: string) {
    if (!confirm('هل أنت متأكد من إزالة هذا العنصر من القائمة السوداء؟')) return;
    this.http.delete<any>(`${this.apiUrl}/blacklist/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
        }
      }
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

  getTypeBadge(type: string): string {
    const map: Record<string, string> = {
      'Phone': 'badge-info',
      'Email': 'badge-warning',
      'Device': 'badge-error',
      'IP': 'badge-returned'
    };
    return map[type] || 'badge-inactive';
  }
}
