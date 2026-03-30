import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin/invoices';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  invoiceStats = signal<any>(null);

  // Detail
  showDetail = signal(false);
  selectedInvoice = signal<any>(null);

  // Create
  showCreate = signal(false);
  newInvoice = {
    partnerId: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
    dueDate: '',
    notes: ''
  };

  ngOnInit() {
    this.loadData();
    this.loadStats();
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

  loadStats() {
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (res) => { if (res.isSuccess) this.invoiceStats.set(res.data); }
    });
  }

  exportInvoices() {
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const toDate = now.toISOString();
    window.open(`${this.apiUrl}/export?format=csv&fromDate=${fromDate}&toDate=${toDate}`, '_blank');
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
      1: 'badge-pending',
      2: 'badge-success',
      3: 'badge-error',
      4: 'badge-cancelled'
    };
    return map[status] ?? 'badge-inactive';
  }

  getStatusLabel(status: number): string {
    const map: Record<number, string> = {
      0: 'مسودة',
      1: 'صادرة',
      2: 'مدفوعة',
      3: 'متأخرة',
      4: 'ملغاة'
    };
    return map[status] ?? status?.toString();
  }

  // View detail
  viewInvoice(id: string) {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedInvoice.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  // Create
  openCreate() {
    this.newInvoice = {
      partnerId: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
      dueDate: '',
      notes: ''
    };
    this.showCreate.set(true);
  }

  addLineItem() {
    this.newInvoice.lineItems.push({ description: '', quantity: 1, unitPrice: 0 });
  }

  removeLineItem(i: number) {
    this.newInvoice.lineItems.splice(i, 1);
  }

  createInvoice() {
    this.http.post<any>(`${this.apiUrl}/generate`, this.newInvoice).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showCreate.set(false);
          this.loadData();
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في إنشاء الفاتورة')
    });
  }

  // Mark paid
  markPaid(id: string) {
    this.http.put<any>(`${this.apiUrl}/${id}/status`, { status: 'Paid' }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.showDetail()) this.viewInvoice(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ')
    });
  }

  // Cancel
  cancelInvoice(id: string) {
    const reason = prompt('سبب الإلغاء:');
    if (!reason) return;

    this.http.put<any>(`${this.apiUrl}/${id}/status`, { status: 'Cancelled', reason }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.showDetail()) this.viewInvoice(id);
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ')
    });
  }

  // Download PDF
  downloadPdf(id: string) {
    window.open(`${this.apiUrl}/${id}/download`, '_blank');
  }

  generateBulk() {
    this.http.post<any>(`${this.apiUrl}/generate-bulk`, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          alert('تم إنشاء الفواتير بنجاح');
          this.loadData();
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في إنشاء الفواتير')
    });
  }

  // Send email
  sendEmail(id: string) {
    const email = prompt('الإيميل:');
    if (!email) return;
    const message = prompt('رسالة (اختياري):') || '';

    this.http.post<any>(`${this.apiUrl}/${id}/send`, { email, message }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          alert('تم الإرسال بنجاح');
        } else {
          alert(res.message || 'حصل خطأ');
        }
      },
      error: () => alert('حصل خطأ في الإرسال')
    });
  }
}
