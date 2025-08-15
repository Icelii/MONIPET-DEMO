import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status >= 500) {
          router.navigate(['/server-error'], { state: { code: error.status } });
        } else if (error.status === 404) {
          router.navigate(['/not-found'], { state: { code: 404 } });
        }
      }
      return throwError(() => error);
    })
  );
};
