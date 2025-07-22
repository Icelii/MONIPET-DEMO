import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';
import { OrdenDetailComponent } from './features/dashboard/pages/orden-detail/orden-detail.component';

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
      { path: 'services', loadComponent: () => import('./features/services/pages/services/services.component').then(c => c.ServicesComponent) },
      { path: 'services/schedule-service', loadComponent: () => import('./features/services/pages/appointment/appointment.component').then(c => c.AppointmentComponent) },
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
      { path: 'dashboard/pets', loadComponent: () => import('./features/dashboard/pages/pets/pets.component').then(c => c.PetsComponent) },
      { path: 'dashboard/adoption-list', loadComponent: () => import('./features/dashboard/pages/adoption-list/adoption-list.component').then(c => c.AdoptionListComponent) },
      { path: 'dashboard/orders', loadComponent: () => import('./features/dashboard/pages/orders/orders.component').then(c => c.OrdersComponent) },
      { path: 'dashboard/orders/detail', loadComponent: () => import('./features/dashboard/pages/orden-detail/orden-detail.component').then(c => OrdenDetailComponent) },
      { path: 'dashboard/favorites', loadComponent: () => import('./features/dashboard/pages/favorites/favorites.component').then(c => c.FavoritesComponent) },
      { path: 'dashboard/reports', loadComponent: () => import('./features/dashboard/pages/reports/reports.component').then(c => c.ReportsComponent) },
      { path: 'dashboard/appointments', loadComponent: () => import('./features/dashboard/pages/appointments/appointments.component').then(c => c.AppointmentsComponent) },
      { path: 'dashboard/appointments/service', loadComponent: () => import('./features/dashboard/pages/service-appointment-detail/service-appointment-detail.component').then(c => c.ServiceAppointmentDetailComponent) },
      { path: 'dashboard/appointments/adoption', loadComponent: () => import('./features/dashboard/pages/adoption-appointment-detail/adoption-appointment-detail.component').then(c => c.AdoptionAppointmentDetailComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
