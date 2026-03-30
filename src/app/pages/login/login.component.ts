import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  phone = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  onSubmit() {
    if (!this.phone || !this.password) {
      this.error.set('من فضلك ادخل رقم الموبايل وكلمة المرور');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http.post<any>('/api/v1/auth/login', {
      phoneNumber: this.phone,
      password: this.password
    }).subscribe({
      next: (data) => {
        if (data.isSuccess && data.data?.token) {
          localStorage.setItem('sekka_token', data.data.token);
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(data.message || 'بيانات الدخول غير صحيحة');
        }
        this.loading.set(false);
      },
      error: (err) => {
        if (err.error?.message) {
          this.error.set(err.error.message);
        } else {
          this.error.set('حدث خطأ في الاتصال بالسيرفر');
        }
        this.loading.set(false);
      }
    });
  }
}
