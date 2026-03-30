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

  // NEW API endpoints
  overview = signal<any>(null);          // GET /insights/overview
  heatmapData = signal<any>(null);       // GET /insights/heatmap
  trends = signal<any>(null);            // GET /insights/trends
  engagement = signal<any>(null);        // GET /insights/engagement-distribution
  rfmAnalysis = signal<any>(null);       // GET /insights/rfm-analysis
  behaviorSummary = signal<any>(null);   // GET /insights/behavior-summary
  categoryPerformance = signal<any>(null); // GET /insights/category-performance

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const to = now.toISOString().split('T')[0];

    // 1. Overview
    this.http.get<any>(`${this.apiUrl}/insights/overview?period=month`).subscribe({
      next: (res) => { if (res.isSuccess) this.overview.set(res.data); }
    });

    // 2. Activity Heatmap
    this.http.get<any>(`${this.apiUrl}/insights/heatmap?period=week`).subscribe({
      next: (res) => { if (res.isSuccess) this.heatmapData.set(res.data); }
    });

    // 3. Trends
    this.http.get<any>(`${this.apiUrl}/insights/trends?fromDate=${from}&toDate=${to}&metric=orders`).subscribe({
      next: (res) => { if (res.isSuccess) this.trends.set(res.data); }
    });

    // 4. Engagement Distribution
    this.http.get<any>(`${this.apiUrl}/insights/engagement-distribution`).subscribe({
      next: (res) => { if (res.isSuccess) this.engagement.set(res.data); }
    });

    // 5. RFM Analysis
    this.http.get<any>(`${this.apiUrl}/insights/rfm-analysis`).subscribe({
      next: (res) => { if (res.isSuccess) this.rfmAnalysis.set(res.data); }
    });

    // 6. Behavior Summary
    this.http.get<any>(`${this.apiUrl}/insights/behavior-summary`).subscribe({
      next: (res) => { if (res.isSuccess) this.behaviorSummary.set(res.data); }
    });

    // 7. Category Performance
    this.http.get<any>(`${this.apiUrl}/insights/category-performance?period=month`).subscribe({
      next: (res) => {
        if (res.isSuccess) this.categoryPerformance.set(res.data);
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
