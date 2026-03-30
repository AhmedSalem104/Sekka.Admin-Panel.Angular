import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import {
  Chart, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { HttpClient } from '@angular/common/http';

Chart.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private api = '/api/v1/admin';

  loading = signal(true);
  Math = Math;

  // Real API data
  realtime = signal<any>(null);         // GET /statistics/realtime
  financialSummary = signal<any>(null);  // GET /statistics/financial-summary
  growth = signal<any>(null);            // GET /statistics/growth
  regionStats = signal<any[]>([]);       // GET /statistics/regions
  orderBoard = signal<any>(null);        // GET /orders/board
  recentOrders = signal<any[]>([]);      // GET /orders
  subscriptionStats = signal<any>(null); // GET /subscriptions/stats
  disputeStats = signal<any>(null);      // GET /disputes/stats
  refundStats = signal<any>(null);       // GET /refunds/stats
  walletStats = signal<any>(null);       // GET /wallets/stats
  vehicleStats = signal<any>(null);      // GET /vehicles/stats
  driversCount = signal(0);
  customersCount = signal(0);
  partnersCount = signal(0);

  // Charts
  revenueChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1A202C', titleFont: { family: 'Tajawal' }, bodyFont: { family: 'Tajawal' }, rtl: true, textDirection: 'rtl', padding: 12, cornerRadius: 8 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Tajawal', size: 11 }, color: '#718096' } },
      y: { grid: { color: 'rgba(226,232,240,0.5)' }, ticks: { font: { family: 'Tajawal', size: 11 }, color: '#718096' } }
    }
  };

  orderBoardChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0, hoverOffset: 4 }] };
  orderBoardChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: { legend: { position: 'bottom', rtl: true, labels: { font: { family: 'Tajawal', size: 12 }, color: '#4A5568', usePointStyle: true, pointStyle: 'circle', padding: 16 } } }
  };

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = now.toISOString();
    let loaded = 0;
    const checkDone = () => { loaded++; if (loaded >= 13) this.loading.set(false); };

    // 1. Real-time stats
    this.http.get<any>(`${this.api}/statistics/realtime`).subscribe({
      next: r => { if (r.isSuccess) this.realtime.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 2. Revenue chart
    this.http.get<any>(`${this.api}/statistics/revenue?from=${from}&to=${to}&groupBy=day`).subscribe({
      next: r => {
        if (r.isSuccess && r.data?.timeline?.length) {
          this.revenueChartData = {
            labels: r.data.timeline.map((t: any) => { const d = new Date(t.period); return `${d.getDate()}/${d.getMonth() + 1}`; }),
            datasets: [{
              data: r.data.timeline.map((t: any) => t.revenue),
              borderColor: '#FC5D01', backgroundColor: 'rgba(252,93,1,0.1)',
              borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#FC5D01'
            }]
          };
        }
        checkDone();
      },
      error: () => checkDone()
    });

    // 3. Financial summary
    this.http.get<any>(`${this.api}/statistics/financial-summary?from=${from}&to=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.financialSummary.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 4. Growth
    this.http.get<any>(`${this.api}/statistics/growth?months=3`).subscribe({
      next: r => { if (r.isSuccess) this.growth.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 5. Region stats
    this.http.get<any>(`${this.api}/statistics/regions?from=${from}&to=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.regionStats.set(r.data || []); checkDone(); },
      error: () => checkDone()
    });

    // 6. Order board (real order status counts)
    this.http.get<any>(`${this.api}/orders/board`).subscribe({
      next: r => {
        if (r.isSuccess && r.data) {
          this.orderBoard.set(r.data);
          const board = r.data;
          const statuses = [
            { label: 'مستني', count: board.pending?.count || 0, color: '#3182CE' },
            { label: 'متعين', count: board.assigned?.count || 0, color: '#805AD5' },
            { label: 'في السكة', count: board.inTransit?.count || 0, color: '#FC5D01' },
            { label: 'اتسلّم', count: board.delivered?.count || 0, color: '#38A169' },
            { label: 'ملغي', count: board.cancelled?.count || 0, color: '#E53E3E' },
          ].filter(s => s.count > 0);
          this.orderBoardChartData = {
            labels: statuses.map(s => s.label),
            datasets: [{ data: statuses.map(s => s.count), backgroundColor: statuses.map(s => s.color), borderWidth: 0, hoverOffset: 4 }]
          };
        }
        checkDone();
      },
      error: () => checkDone()
    });

    // 7. Recent orders
    this.http.get<any>(`${this.api}/orders?pageNumber=1&pageSize=5&sortDesc=true`).subscribe({
      next: r => { if (r.isSuccess) this.recentOrders.set(r.data?.items || []); checkDone(); },
      error: () => checkDone()
    });

    // 8. Subscription stats
    this.http.get<any>(`${this.api}/subscriptions/stats`).subscribe({
      next: r => { if (r.isSuccess) this.subscriptionStats.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 9. Dispute stats
    this.http.get<any>(`${this.api}/disputes/stats`).subscribe({
      next: r => { if (r.isSuccess) this.disputeStats.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 10. Refund stats
    this.http.get<any>(`${this.api}/refunds/stats`).subscribe({
      next: r => { if (r.isSuccess) this.refundStats.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 11. Wallet stats
    this.http.get<any>(`${this.api}/wallets/stats`).subscribe({
      next: r => { if (r.isSuccess) this.walletStats.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 12. Vehicle stats
    this.http.get<any>(`${this.api}/vehicles/stats`).subscribe({
      next: r => { if (r.isSuccess) this.vehicleStats.set(r.data); checkDone(); },
      error: () => checkDone()
    });

    // 13. Counts (drivers, customers, partners)
    this.http.get<any>(`${this.api}/drivers?pageNumber=1&pageSize=1`).subscribe({
      next: r => { if (r.isSuccess) this.driversCount.set(r.data?.totalCount || 0); }
    });
    this.http.get<any>(`${this.api}/customers?pageNumber=1&pageSize=1`).subscribe({
      next: r => { if (r.isSuccess) this.customersCount.set(r.data?.totalCount || 0); }
    });
    this.http.get<any>(`${this.api}/partners?pageNumber=1&pageSize=1`).subscribe({
      next: r => { if (r.isSuccess) this.partnersCount.set(r.data?.totalCount || 0); checkDone(); },
      error: () => checkDone()
    });
  }

  getTotalBoardOrders(): number {
    const b = this.orderBoard();
    if (!b) return 0;
    return (b.pending?.count || 0) + (b.assigned?.count || 0) + (b.inTransit?.count || 0) + (b.delivered?.count || 0) + (b.cancelled?.count || 0);
  }

  getStatusBadge(status: number): string {
    const m: Record<number, string> = { 0: 'badge-pending', 1: 'badge-info', 2: 'badge-info', 3: 'badge-in-transit', 4: 'badge-arrived', 5: 'badge-delivered', 6: 'badge-cancelled', 7: 'badge-returned' };
    return m[status] || 'badge-inactive';
  }

  getStatusName(status: number): string {
    const m: Record<number, string> = { 0: 'مستني', 1: 'مقبول', 2: 'تم الاستلام', 3: 'في السكة', 4: 'وصل', 5: 'اتسلّم', 6: 'ملغي', 7: 'مرتجع' };
    return m[status] || '—';
  }

  fmt(n: number | undefined): string {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString('ar-EG');
  }

  money(n: number | undefined): string {
    if (!n) return '0 ج.م';
    return n.toLocaleString('ar-EG') + ' ج.م';
  }
}
