import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('sekka_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'ar'
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('sekka_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
