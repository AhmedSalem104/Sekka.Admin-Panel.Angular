import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/admin';

  items = signal<any[]>([]);
  loading = signal(true);
  search = '';
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  // Create role form
  showCreateForm = false;
  newRoleName = '';
  newRoleDescription = '';
  creating = signal(false);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    const token = localStorage.getItem('sekka_token');
    let url = `${this.apiUrl}/roles?pageNumber=${this.currentPage}&pageSize=10`;
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

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  createRole() {
    if (!this.newRoleName) return;
    this.creating.set(true);
    const token = localStorage.getItem('sekka_token');
    this.http.post<any>(`${this.apiUrl}/roles`, {
      name: this.newRoleName,
      description: this.newRoleDescription
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.newRoleName = '';
          this.newRoleDescription = '';
          this.showCreateForm = false;
          this.loadData();
        }
        this.creating.set(false);
      },
      error: () => this.creating.set(false)
    });
  }

  deleteRole(role: any) {
    if (!confirm(`هل أنت متأكد من حذف الدور "${role.name}"؟`)) return;
    const token = localStorage.getItem('sekka_token');
    this.http.delete<any>(`${this.apiUrl}/roles/${role.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        if (res.isSuccess) this.loadData();
      }
    });
  }
}
