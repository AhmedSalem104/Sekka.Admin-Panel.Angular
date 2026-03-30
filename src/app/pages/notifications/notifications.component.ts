import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  // Send notification form
  showSendForm = false;
  sendTitle = '';
  sendBody = '';
  sendTarget = 'all';
  sending = signal(false);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    const token = localStorage.getItem('sekka_token');
    let url = `${this.apiUrl}/notifications?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;

    this.http.get<any>(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
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

  toggleSendForm() {
    this.showSendForm = !this.showSendForm;
  }

  sendNotification() {
    if (!this.sendTitle || !this.sendBody) return;
    this.sending.set(true);
    const token = localStorage.getItem('sekka_token');
    this.http.post<any>(`${this.apiUrl}/notifications/send`, {
      title: this.sendTitle,
      body: this.sendBody,
      target: this.sendTarget
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.sendTitle = '';
          this.sendBody = '';
          this.showSendForm = false;
          this.loadData();
        }
        this.sending.set(false);
      },
      error: () => this.sending.set(false)
    });
  }
}
