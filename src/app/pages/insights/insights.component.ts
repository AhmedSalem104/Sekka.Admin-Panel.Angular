import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss'
})
export class InsightsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  activeTab = 'insights';
  loading = signal(true);

  insights = signal<any[]>([]);
  demandForecast = signal<any[]>([]);
  churnRisk = signal<any[]>([]);
  revenueOptimization = signal<any>(null);
  supplyDemand = signal<any>(null);
  anomalies = signal<any[]>([]);
  cohortAnalysis = signal<any>(null);

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);

    // Business Insights
    this.http.get<any>(`${this.apiUrl}/insights`).subscribe({
      next: (res) => { if (res.isSuccess) this.insights.set(res.data || []); }
    });

    // Demand Forecast
    this.http.get<any>(`${this.apiUrl}/insights/demand-forecast?days=7`).subscribe({
      next: (res) => { if (res.isSuccess) this.demandForecast.set(res.data?.forecast || []); }
    });

    // Churn Risk
    this.http.get<any>(`${this.apiUrl}/insights/churn-risk?userType=customer&pageSize=10`).subscribe({
      next: (res) => { if (res.isSuccess) this.churnRisk.set(res.data?.items || []); }
    });

    // Revenue Optimization
    this.http.get<any>(`${this.apiUrl}/insights/revenue-optimization`).subscribe({
      next: (res) => { if (res.isSuccess) this.revenueOptimization.set(res.data); }
    });

    // Supply-Demand
    this.http.get<any>(`${this.apiUrl}/insights/supply-demand`).subscribe({
      next: (res) => { if (res.isSuccess) this.supplyDemand.set(res.data); }
    });

    // Anomalies
    this.http.get<any>(`${this.apiUrl}/insights/anomalies`).subscribe({
      next: (res) => { if (res.isSuccess) this.anomalies.set(res.data || []); }
    });

    // Cohort Analysis
    this.http.get<any>(`${this.apiUrl}/insights/cohort-analysis?months=6`).subscribe({
      next: (res) => {
        if (res.isSuccess) this.cohortAnalysis.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getSeverityBadge(severity: string): string {
    const map: Record<string, string> = { high: 'badge-error', warning: 'badge-warning', medium: 'badge-warning', info: 'badge-info', low: 'badge-success' };
    return map[severity] || 'badge-inactive';
  }

  getChurnBadge(level: string): string {
    const map: Record<string, string> = { High: 'badge-error', Medium: 'badge-warning', Low: 'badge-success' };
    return map[level] || 'badge-inactive';
  }
}
