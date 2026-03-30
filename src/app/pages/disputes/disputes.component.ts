import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disputes.component.html',
  styleUrl: './disputes.component.scss'
})
export class DisputesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';
  Math = Math;

  items = signal<any[]>([]);
  loading = signal(true);
  showDetail = signal(false);
  selectedDispute = signal<any>(null);
  search = '';
  statusFilter = '';
  priorityFilter = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    let url = `${this.apiUrl}/disputes?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    if (this.statusFilter) url += `&status=${this.statusFilter}`;
    if (this.priorityFilter) url += `&priority=${this.priorityFilter}`;

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

  viewDispute(id: string) {
    this.http.get<any>(`${this.apiUrl}/disputes/${id}`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.selectedDispute.set(res.data);
          this.showDetail.set(true);
        }
      }
    });
  }

  resolveDispute(id: string) {
    const resolution = prompt('أدخل قرار الحل:');
    if (!resolution) return;
    this.http.put<any>(`${this.apiUrl}/disputes/${id}/resolve`, {
      resolution,
      favoredParty: 'customer'
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.selectedDispute()?.id === id) {
            this.viewDispute(id);
          }
        }
      }
    });
  }

  escalateDispute(id: string) {
    const reason = prompt('أدخل سبب التصعيد:');
    if (!reason) return;
    this.http.put<any>(`${this.apiUrl}/disputes/${id}/escalate`, {
      reason,
      newPriority: 3
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.selectedDispute()?.id === id) {
            this.viewDispute(id);
          }
        }
      }
    });
  }

  respondDispute(id: string) {
    const message = prompt('أدخل الرد:');
    if (!message) return;
    this.http.post<any>(`${this.apiUrl}/disputes/${id}/respond`, {
      message
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.loadData();
          if (this.selectedDispute()?.id === id) {
            this.viewDispute(id);
          }
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

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'Open': 'badge-pending',
      'InProgress': 'badge-in-transit',
      'Resolved': 'badge-success',
      'Closed': 'badge-inactive',
      'Escalated': 'badge-escalated'
    };
    return map[status] || 'badge-inactive';
  }

  getPriorityBadge(priority: string): string {
    const map: Record<string, string> = {
      'Critical': 'badge-error',
      'High': 'badge-warning',
      'Medium': 'badge-in-transit',
      'Low': 'badge-info'
    };
    return map[priority] || 'badge-inactive';
  }
}
