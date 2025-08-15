import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        loaderService.hide();
      }
    })
  );
};
