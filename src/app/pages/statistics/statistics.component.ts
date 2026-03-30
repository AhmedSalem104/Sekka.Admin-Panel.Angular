import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  private http = inject(HttpClient);
  private api = '/api/v1/admin';

  loading = signal(true);
  activeTab = 'platform';

  // All statistics signals
  platform = signal<any>(null);           // GET /statistics/platform
  platformDaily = signal<any>(null);      // GET /statistics/platform/daily
  platformWeekly = signal<any>(null);     // GET /statistics/platform/weekly
  platformMonthly = signal<any>(null);    // GET /statistics/platform/monthly
  realtime = signal<any>(null);           // GET /statistics/realtime
  revenue = signal<any>(null);            // GET /statistics/revenue
  revenueBreakdown = signal<any>(null);   // GET /statistics/revenue/breakdown
  financialSummary = signal<any>(null);   // GET /statistics/financial-summary
  growth = signal<any>(null);             // GET /statistics/growth
  regions = signal<any[]>([]);            // GET /statistics/regions
  regionsHeatmap = signal<any>(null);     // GET /statistics/regions/heatmap
  cancellations = signal<any>(null);      // GET /statistics/cancellations
  deliveryPerf = signal<any>(null);       // GET /statistics/delivery-performance
  orderHourly = signal<any>(null);        // GET /statistics/orders/hourly
  orderStatus = signal<any>(null);        // GET /statistics/orders/status-breakdown
  driversRanking = signal<any[]>([]);     // GET /statistics/drivers/ranking
  topCustomers = signal<any[]>([]);       // GET /statistics/customers/top
  topPartners = signal<any[]>([]);        // GET /statistics/partners/top

  // Revenue Line Chart
  revenueChartData: ChartData<'line'> = { labels: [], datasets: [] };
  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    const now = new Date();
    const from = now.toISOString().split('T')[0].slice(0, 8) + '01';
    const to = now.toISOString().split('T')[0];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Platform overview
    this.http.get<any>(`${this.api}/statistics/platform`).subscribe({
      next: r => { if (r.isSuccess) this.platform.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/platform/daily?date=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.platformDaily.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/platform/monthly?year=${year}&month=${month}`).subscribe({
      next: r => { if (r.isSuccess) this.platformMonthly.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/realtime`).subscribe({
      next: r => { if (r.isSuccess) this.realtime.set(r.data); }
    });

    // Revenue
    this.http.get<any>(`${this.api}/statistics/revenue?fromDate=${from}&toDate=${to}`).subscribe({
      next: r => {
        if (r.isSuccess) {
          this.revenue.set(r.data);
          if (r.data?.timeline?.length) {
            this.revenueChartData = {
              labels: r.data.timeline.map((t: any) => { const d = new Date(t.period || t.date); return `${d.getDate()}/${d.getMonth()+1}`; }),
              datasets: [{ data: r.data.timeline.map((t: any) => t.revenue || t.amount || 0), borderColor: '#FC5D01', backgroundColor: 'rgba(252,93,1,0.1)', fill: true, tension: 0.4 }]
            };
          }
        }
      }
    });
    this.http.get<any>(`${this.api}/statistics/revenue/breakdown?period=month`).subscribe({
      next: r => { if (r.isSuccess) this.revenueBreakdown.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/financial-summary?period=month`).subscribe({
      next: r => { if (r.isSuccess) this.financialSummary.set(r.data); }
    });

    // Growth
    this.http.get<any>(`${this.api}/statistics/growth?period=monthly`).subscribe({
      next: r => { if (r.isSuccess) this.growth.set(r.data); }
    });

    // Orders
    this.http.get<any>(`${this.api}/statistics/orders/hourly?date=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.orderHourly.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/orders/status-breakdown?fromDate=${from}&toDate=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.orderStatus.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/cancellations?fromDate=${from}&toDate=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.cancellations.set(r.data); }
    });
    this.http.get<any>(`${this.api}/statistics/delivery-performance?fromDate=${from}&toDate=${to}`).subscribe({
      next: r => { if (r.isSuccess) this.deliveryPerf.set(r.data); }
    });

    // Regions
    this.http.get<any>(`${this.api}/statistics/regions`).subscribe({
      next: r => { if (r.isSuccess) this.regions.set(r.data || []); }
    });
    this.http.get<any>(`${this.api}/statistics/regions/heatmap`).subscribe({
      next: r => { if (r.isSuccess) this.regionsHeatmap.set(r.data); }
    });

    // Rankings
    this.http.get<any>(`${this.api}/statistics/drivers/ranking?metric=completionRate&limit=10`).subscribe({
      next: r => { if (r.isSuccess) this.driversRanking.set(r.data || []); }
    });
    this.http.get<any>(`${this.api}/statistics/customers/top?limit=10&metric=totalSpent`).subscribe({
      next: r => { if (r.isSuccess) this.topCustomers.set(r.data || []); }
    });
    this.http.get<any>(`${this.api}/statistics/partners/top?limit=10&metric=revenue`).subscribe({
      next: r => {
        if (r.isSuccess) this.topPartners.set(r.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportStats(type: string) {
    const now = new Date();
    const from = now.toISOString().split('T')[0].slice(0, 8) + '01';
    const to = now.toISOString().split('T')[0];
    window.open(`${this.api}/statistics/export?type=${type}&format=csv&fromDate=${from}&toDate=${to}`, '_blank');
  }
}
