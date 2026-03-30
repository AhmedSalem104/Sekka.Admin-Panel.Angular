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
  private apiUrl = '/api/v1/admin';

  loading = signal(true);
  period = 'month';

  revenue = signal<any>({});
  orders = signal<any>({});
  drivers = signal<any>({});
  customers = signal<any>({});
  topDrivers = signal<any[]>([]);
  topCustomers = signal<any[]>([]);

  // Revenue Line Chart
  revenueChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'الإيرادات',
      borderColor: '#38A169',
      backgroundColor: 'rgba(56, 161, 105, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Orders Doughnut Chart
  ordersChartData: ChartData<'doughnut'> = {
    labels: ['مكتمل', 'ملغي', 'قيد التنفيذ', 'معلق'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#38A169', '#E53E3E', '#6C63FF', '#ECC94B']
    }]
  };

  ordersChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Tajawal' } }
      }
    }
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    const token = localStorage.getItem('sekka_token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(`${this.apiUrl}/statistics?period=${this.period}`, { headers }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const d = res.data || {};
          this.revenue.set(d.revenue || {});
          this.orders.set(d.orders || {});
          this.drivers.set(d.drivers || {});
          this.customers.set(d.customers || {});
          this.topDrivers.set(d.topDrivers || []);
          this.topCustomers.set(d.topCustomers || []);

          // Populate revenue chart
          if (d.revenueChart && d.revenueChart.length > 0) {
            this.revenueChartData = {
              labels: d.revenueChart.map((item: any) => item.label),
              datasets: [{
                data: d.revenueChart.map((item: any) => item.value || 0),
                label: 'الإيرادات',
                borderColor: '#38A169',
                backgroundColor: 'rgba(56, 161, 105, 0.1)',
                fill: true,
                tension: 0.4
              }]
            };
          }

          // Populate orders chart
          if (d.orders?.breakdown) {
            this.ordersChartData = {
              labels: ['مكتمل', 'ملغي', 'قيد التنفيذ', 'معلق'],
              datasets: [{
                data: [
                  d.orders.breakdown.completed || 0,
                  d.orders.breakdown.cancelled || 0,
                  d.orders.breakdown.inProgress || 0,
                  d.orders.breakdown.pending || 0
                ],
                backgroundColor: ['#38A169', '#E53E3E', '#6C63FF', '#ECC94B']
              }]
            };
          }
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPeriodChange() {
    this.loadData();
  }
}
