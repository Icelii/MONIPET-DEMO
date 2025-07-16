import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/pages/home/home.component').then(c => c.HomeComponent) },
      { path: 'adopt', loadComponent: () => import('./features/adopt/pages/adopt/adopt.component').then(c => c.AdoptComponent) },
      { path: 'adopt/details', loadComponent: () => import('./features/adopt/pages/details/details.component').then(c => c.DetailsComponent) },
      { path: 'adopt/schedule-adoption', loadComponent: () => import('./features/adopt/pages/appointment/appointment.component').then(c => c.AppointmentComponent) },
      { path: 'products', loadComponent: () => import('./features/products/pages/products/products.component').then(c => c.ProductsComponent) },
      { path: 'products/details', loadComponent: () => import('./features/products/pages/details/details.component').then(c => c.DetailsComponent) },
      { path: 'products/cart', loadComponent: () => import('./features/products/pages/cart/cart.component').then(c => c.CartComponent) },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(c => c.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(c => c.RegisterComponent) },
      { path: 'auth-code', loadComponent: () => import('./features/auth/pages/auth-code/auth-code.component').then(c => c.AuthCodeComponent) },
      { path: 'account-recovery', loadComponent: () => import('./features/auth/pages/recovery-account/recovery-account.component').then(c => c.RecoveryAccountComponent) },
      { path: 'new-password', loadComponent: () => import('./features/auth/pages/new-password/new-password.component').then(c => c.NewPasswordComponent) },
    ],
  },
  {
    path: '',
    component: UserDashboardLayoutComponent,
    children: [
      { path: 'dashboard/profile', loadComponent: () => import('./features/dashboard/pages/profile/profile.component').then(c => c.ProfileComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
