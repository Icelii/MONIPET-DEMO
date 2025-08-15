import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { delay, of, switchMap } from 'rxjs';

export const tokenGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return of(null).pipe(
    delay(0),
    switchMap(() => {
      if (authService.getToken()) {
        return of(true);
      } else {
        router.navigateByUrl('/login');
        return of(false);
      }
    })
  );
};
