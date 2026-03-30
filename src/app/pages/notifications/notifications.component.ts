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
  private api = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  Math = Math;

  // Send forms
  showSendDriver = signal(false);
  showBroadcast = signal(false);
  sending = signal(false);

  // Send to driver
  driverTitle = '';
  driverBody = '';
  driverIds: string[] = [];
  driverIdInput = '';

  // Broadcast
  broadcastTitle = '';
  broadcastBody = '';
  broadcastTarget = 'All';

  ngOnInit() { this.loadData(); }

  loadData() {
    this.loading.set(true);
    let url = `${this.api}/notifications/history?pageNumber=${this.currentPage}&pageSize=10`;
    if (this.search) url += `&search=${this.search}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.items.set(res.data?.items || res.data || []);
          this.totalPages = res.data?.totalPages || 1;
          this.totalCount = res.data?.totalCount || 0;
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() { this.currentPage = 1; this.loadData(); }
  onPageChange(page: number) { this.currentPage = page; this.loadData(); }

  // Send to specific driver(s)
  sendToDriver() {
    if (!this.driverTitle || !this.driverBody || !this.driverIdInput) return;
    this.sending.set(true);
    this.http.post<any>(`${this.api}/notifications/send-to-driver`, {
      driverIds: this.driverIdInput.split(',').map(id => id.trim()),
      title: this.driverTitle,
      body: this.driverBody
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.showSendDriver.set(false); this.driverTitle = ''; this.driverBody = ''; this.driverIdInput = ''; this.loadData(); }
        this.sending.set(false);
      },
      error: () => this.sending.set(false)
    });
  }

  // Broadcast to all / segment
  broadcast() {
    if (!this.broadcastTitle || !this.broadcastBody) return;
    this.sending.set(true);
    this.http.post<any>(`${this.api}/notifications/broadcast`, {
      title: this.broadcastTitle,
      body: this.broadcastBody,
      target: this.broadcastTarget
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.showBroadcast.set(false); this.broadcastTitle = ''; this.broadcastBody = ''; this.loadData(); }
        this.sending.set(false);
      },
      error: () => this.sending.set(false)
    });
  }
}
