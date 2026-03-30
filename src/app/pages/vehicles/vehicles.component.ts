import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin/vehicles';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  typeFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  // Detail
  showDetail = signal(false);
  selectedVehicle = signal<any>(null);

  // Create
  showCreate = signal(false);
  newVehicle = {
    driverId: '',
    type: 0,
    plateNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: ''
  };

  // Stats
  stats = signal<any>(null);

  ngOnInit() {
    this.loadData();
    this.loadStats();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.typeFilter !== '') url += `&type=${this.typeFilter}`;

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
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.stats.set(res.data);
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

  getVehicleType(type: number): string {
    const map: Record<number, string> = {
      0: 'موتوسيكل',
      1: 'سيارة',
      2: 'فان',
      3: 'تراك',
      4: 'دراجة'
    };
    return map[type] ?? type?.toString();
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'Active': 'badge-success',
      'Inactive': 'badge-inactive',
      'Suspended': 'badge-error'
    };
    return map[status] || 'badge-inactive';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'Active': 'نشطة',
      'Inactive': 'غير نشطة',
      'Suspended': 'موقوفة'
    };
    return map[status] || status;
  }

  getInspectionBadge(status: string): string {
    const map: Record<string, string> = {
      'Passed': 'badge-success',
      'Pending': 'badge-pending',
      'Failed': 'badge-error',
      'Expired': 'badge-warning'
    };
    return map[status] || 'badge-inactive';
  }

  // View detail
  viewVehicle(id: string) {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedVehicle.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  // Create
  openCreate() {
    this.newVehicle = {
      driverId: '',
      type: 0,
      plateNumber: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: ''
    };
    this.showCreate.set(true);
  }

  createVehicle() {
    this.http.post<any>(this.apiUrl, this.newVehicle).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showCreate.set(false);
          this.loadData();
          this.loadStats();
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في إنشاء المركبة')
    });
  }

  // Activate
  activateVehicle(id: string) {
    this.http.put<any>(`${this.apiUrl}/${id}/activate`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          this.loadStats();
          if (this.showDetail()) this.viewVehicle(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ')
    });
  }

  // Deactivate
  deactivateVehicle(id: string) {
    this.http.put<any>(`${this.apiUrl}/${id}/deactivate`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          this.loadStats();
          if (this.showDetail()) this.viewVehicle(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ')
    });
  }

  // Record Inspection
  recordInspection(id: string) {
    const result = prompt('نتيجة الفحص (Passed / Failed):');
    if (!result) return;
    const notes = prompt('ملاحظات الفحص:') || '';

    this.http.post<any>(`${this.apiUrl}/${id}/inspect`, { result, notes }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          this.loadStats();
          if (this.showDetail()) this.viewVehicle(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في تسجيل الفحص')
    });
  }
}
