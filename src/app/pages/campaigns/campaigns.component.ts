import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin/campaigns';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  // Detail
  showDetail = signal(false);
  selectedCampaign = signal<any>(null);

  // Create
  showCreate = signal(false);
  newCampaign = {
    name: '',
    description: '',
    type: '',
    promoCode: '',
    discountType: 'Percentage',
    discountValue: 0,
    maxDiscount: 0,
    minOrderAmount: 0,
    maxUsage: 0,
    maxUsagePerUser: 0,
    startDate: '',
    endDate: ''
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter !== '') url += `&status=${this.statusFilter}`;

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

  getStatusBadge(status: number): string {
    const map: Record<number, string> = {
      0: 'badge-draft',
      1: 'badge-active',
      2: 'badge-warning',
      3: 'badge-inactive',
      4: 'badge-cancelled'
    };
    return map[status] ?? 'badge-inactive';
  }

  getStatusLabel(status: number): string {
    const map: Record<number, string> = {
      0: 'مسودة',
      1: 'نشطة',
      2: 'متوقفة',
      3: 'منتهية',
      4: 'ملغاة'
    };
    return map[status] ?? status?.toString();
  }

  getDiscountTypeLabel(type: string): string {
    return type === 'Percentage' ? 'نسبة مئوية' : 'مبلغ ثابت';
  }

  // View detail
  viewCampaign(id: string) {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedCampaign.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  // Create
  openCreate() {
    this.newCampaign = {
      name: '',
      description: '',
      type: '',
      promoCode: '',
      discountType: 'Percentage',
      discountValue: 0,
      maxDiscount: 0,
      minOrderAmount: 0,
      maxUsage: 0,
      maxUsagePerUser: 0,
      startDate: '',
      endDate: ''
    };
    this.showCreate.set(true);
  }

  createCampaign() {
    this.http.post<any>(this.apiUrl, this.newCampaign).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showCreate.set(false);
          this.loadData();
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في إنشاء الحملة')
    });
  }

  // Activate
  activateCampaign(id: string) {
    this.http.put<any>(`${this.apiUrl}/${id}/activate`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.showDetail()) this.viewCampaign(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ')
    });
  }

  // Pause
  pauseCampaign(id: string) {
    this.http.put<any>(`${this.apiUrl}/${id}/pause`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.showDetail()) this.viewCampaign(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ')
    });
  }

  // Delete
  deleteCampaign(id: string) {
    if (!confirm('هل أنت متأكد من حذف الحملة دي؟')) return;

    this.http.delete<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showDetail.set(false);
          this.loadData();
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في حذف الحملة')
    });
  }
}
