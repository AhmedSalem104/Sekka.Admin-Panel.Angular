import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  private apiUrl = environment.apiBaseUrl;

  loading = signal(true);

  // Dashboard data
  dashboard = signal<any>(null);
  realtime = signal<any>(null);
  kpi = signal<any>(null);

  // Chart configs
  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A202C',
        titleFont: { family: 'Tajawal', size: 13 },
        bodyFont: { family: 'Tajawal', size: 12 },
        rtl: true,
        textDirection: 'rtl',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Tajawal', size: 12 }, color: '#718096' }
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
        ticks: { font: { family: 'Tajawal', size: 12 }, color: '#718096' }
      }
    }
  };

  orderStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['مكتمل', 'ملغي', 'في الطريق', 'مستني'],
    datasets: [{
      data: [82, 5, 8, 5],
      backgroundColor: ['#38A169', '#E53E3E', '#FC5D01', '#3182CE'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  orderStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: {
          font: { family: 'Tajawal', size: 12 },
          color: '#4A5568',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16
        }
      }
    }
  };

  ngOnInit() {
    this.loadDashboard();
  }

  async loadDashboard() {
    this.loading.set(true);
    const token = localStorage.getItem('sekka_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Load dashboard data
      this.http.get<any>(`${this.apiUrl}/statistics/dashboard`, { headers }).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dashboard.set(res.data);
          }
        }
      });

      // Load realtime
      this.http.get<any>(`${this.apiUrl}/statistics/realtime`, { headers }).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.realtime.set(res.data);
          }
        }
      });

      // Load KPIs
      this.http.get<any>(`${this.apiUrl}/statistics/kpi?period=month`, { headers }).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.kpi.set(res.data);
          }
        }
      });

      // Load revenue chart
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const to = now.toISOString();

      this.http.get<any>(`${this.apiUrl}/statistics/revenue?from=${from}&to=${to}&groupBy=day`, { headers }).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data?.timeline) {
            this.revenueChartData = {
              labels: res.data.timeline.map((t: any) => {
                const d = new Date(t.period);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }),
              datasets: [{
                data: res.data.timeline.map((t: any) => t.revenue),
                borderColor: '#FC5D01',
                backgroundColor: 'rgba(252, 93, 1, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#FC5D01'
              }]
            };
          }
        }
      });

    } catch {
      // Handle error silently
    } finally {
      setTimeout(() => this.loading.set(false), 500);
    }
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

  Math = Math;
}
