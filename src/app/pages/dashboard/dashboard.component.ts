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
  private apiUrl = '/api/v1/admin';

  loading = signal(true);
  Math = Math;

  // All API data signals
  dashboard = signal<any>(null);
  realtime = signal<any>(null);
  kpi = signal<any>(null);
  orderStats = signal<any>(null);
  financialSummary = signal<any>(null);
  platformHealth = signal<any>(null);
  growth = signal<any>(null);
  recentOrders = signal<any[]>([]);
  topDrivers = signal<any[]>([]);
  regionStats = signal<any[]>([]);

  // Revenue Line Chart
  revenueChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A202C',
        titleFont: { family: 'Tajawal', size: 13 },
        bodyFont: { family: 'Tajawal', size: 12 },
        rtl: true, textDirection: 'rtl', padding: 12, cornerRadius: 8,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Tajawal', size: 12 }, color: '#718096' } },
      y: { grid: { color: 'rgba(226, 232, 240, 0.5)' }, ticks: { font: { family: 'Tajawal', size: 12 }, color: '#718096' } }
    }
  };

  // Order Status Doughnut - will be populated from API
  orderStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0, hoverOffset: 4 }]
  };
  orderStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom', rtl: true,
        labels: { font: { family: 'Tajawal', size: 12 }, color: '#4A5568', usePointStyle: true, pointStyle: 'circle', padding: 16 }
      }
    }
  };

  // Orders Bar Chart
  ordersBarData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  ordersBarOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Tajawal', size: 11 }, color: '#718096' } },
      y: { grid: { color: 'rgba(226, 232, 240, 0.5)' }, ticks: { font: { family: 'Tajawal', size: 11 }, color: '#718096' } }
    }
  };

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const to = now.toISOString();

    // 1. Dashboard Overview
    this.http.get<any>(`${this.apiUrl}/statistics/dashboard`).subscribe({
      next: (res) => { if (res.isSuccess) this.dashboard.set(res.data); }
    });

    // 2. Real-time Stats
    this.http.get<any>(`${this.apiUrl}/statistics/realtime`).subscribe({
      next: (res) => { if (res.isSuccess) this.realtime.set(res.data); }
    });

    // 3. KPI Dashboard
    this.http.get<any>(`${this.apiUrl}/statistics/kpi?period=month`).subscribe({
      next: (res) => { if (res.isSuccess) this.kpi.set(res.data); }
    });

    // 4. Revenue Chart (from API)
    this.http.get<any>(`${this.apiUrl}/statistics/revenue?from=${from}&to=${to}&groupBy=day`).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data?.timeline?.length) {
          this.revenueChartData = {
            labels: res.data.timeline.map((t: any) => {
              const d = new Date(t.period);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }),
            datasets: [{
              data: res.data.timeline.map((t: any) => t.revenue),
              borderColor: '#FC5D01',
              backgroundColor: 'rgba(252, 93, 1, 0.1)',
              borderWidth: 2, fill: true, tension: 0.4,
              pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#FC5D01'
            }]
          };
        }
      }
    });

    // 5. Order Statistics (for doughnut chart + order bar chart)
    this.http.get<any>(`${this.apiUrl}/statistics/orders?from=${from}&to=${to}&groupBy=day`).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.orderStats.set(res.data);
          // Populate doughnut from real data
          if (res.data?.byStatus?.length) {
            const statusColors: Record<string, string> = {
              Delivered: '#38A169', Cancelled: '#E53E3E', InTransit: '#FC5D01',
              Pending: '#3182CE', Accepted: '#805AD5', PickedUp: '#ECC94B',
              Arrived: '#ECC94B', Returned: '#718096'
            };
            const statusLabels: Record<string, string> = {
              Delivered: 'اتسلّم', Cancelled: 'ملغي', InTransit: 'في السكة',
              Pending: 'مستني', Accepted: 'مقبول', PickedUp: 'تم الاستلام',
              Arrived: 'وصل', Returned: 'مرتجع'
            };
            this.orderStatusChartData = {
              labels: res.data.byStatus.map((s: any) => statusLabels[s.status] || s.status),
              datasets: [{
                data: res.data.byStatus.map((s: any) => s.count),
                backgroundColor: res.data.byStatus.map((s: any) => statusColors[s.status] || '#A0AEC0'),
                borderWidth: 0, hoverOffset: 4
              }]
            };
          }
          // Populate orders bar chart from timeline
          if (res.data?.timeline?.length) {
            this.ordersBarData = {
              labels: res.data.timeline.map((t: any) => {
                const d = new Date(t.period);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }),
              datasets: [
                {
                  data: res.data.timeline.map((t: any) => t.completed),
                  backgroundColor: '#38A169', label: 'مكتمل', borderRadius: 4
                },
                {
                  data: res.data.timeline.map((t: any) => t.cancelled),
                  backgroundColor: '#E53E3E', label: 'ملغي', borderRadius: 4
                }
              ]
            };
          }
        }
      }
    });

    // 6. Financial Summary
    this.http.get<any>(`${this.apiUrl}/statistics/financial-summary?from=${from}&to=${to}`).subscribe({
      next: (res) => { if (res.isSuccess) this.financialSummary.set(res.data); }
    });

    // 7. Platform Health
    this.http.get<any>(`${this.apiUrl}/statistics/platform-health`).subscribe({
      next: (res) => { if (res.isSuccess) this.platformHealth.set(res.data); }
    });

    // 8. Growth Metrics
    this.http.get<any>(`${this.apiUrl}/statistics/growth?months=3`).subscribe({
      next: (res) => { if (res.isSuccess) this.growth.set(res.data); }
    });

    // 9. Recent Orders (latest 5)
    this.http.get<any>(`${this.apiUrl}/orders?pageNumber=1&pageSize=5&sortDesc=true`).subscribe({
      next: (res) => { if (res.isSuccess) this.recentOrders.set(res.data?.items || []); }
    });

    // 10. Top Drivers
    this.http.get<any>(`${this.apiUrl}/statistics/driver-performance?from=${from}&to=${to}&top=5`).subscribe({
      next: (res) => { if (res.isSuccess) this.topDrivers.set(res.data?.topDrivers || []); }
    });

    // 11. Region Stats
    this.http.get<any>(`${this.apiUrl}/statistics/regions?from=${from}&to=${to}`).subscribe({
      next: (res) => {
        if (res.isSuccess) this.regionStats.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getOrderStatusBadge(status: number): string {
    const map: Record<number, string> = {
      0: 'badge-pending', 1: 'badge-info', 2: 'badge-info', 3: 'badge-in-transit',
      4: 'badge-arrived', 5: 'badge-delivered', 6: 'badge-cancelled', 7: 'badge-returned'
    };
    return map[status] || 'badge-inactive';
  }

  getOrderStatusName(status: number): string {
    const map: Record<number, string> = {
      0: 'مستني', 1: 'مقبول', 2: 'تم الاستلام', 3: 'في السكة',
      4: 'وصل', 5: 'اتسلّم', 6: 'ملغي', 7: 'مرتجع'
    };
    return map[status] || '—';
  }

  formatNumber(num: number | undefined): string {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('ar-EG');
  }

  formatCurrency(num: number | undefined): string {
    if (!num) return '0 ج.م';
    return num.toLocaleString('ar-EG') + ' ج.م';
  }
}
