import { HttpInterceptorFn } from '@angular/common/http';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
