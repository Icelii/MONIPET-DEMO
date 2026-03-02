import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';
import { OrdenDetailComponent } from './features/dashboard/pages/orden-detail/orden-detail.component';
import { tokenGuard } from './core/guards/token.guard';
import { tokenDashboardGuard } from './core/guards/token-dashboard.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/pages/home/home.component').then(c => c.HomeComponent) },
      { path: 'adopt', loadComponent: () => import('./features/adopt/pages/adopt/adopt.component').then(c => c.AdoptComponent) },
      { path: 'adopt/details/:id', loadComponent: () => import('./features/adopt/pages/details/details.component').then(c => c.DetailsComponent) },
      { path: 'adopt/schedule-adoption', loadComponent: () => import('./features/adopt/pages/appointment/appointment.component').then(c => c.AppointmentComponent), canActivate: [tokenGuard] },
      { path: 'products', loadComponent: () => import('./features/products/pages/products/products.component').then(c => c.ProductsComponent) },
      { path: 'products/details/:id', loadComponent: () => import('./features/products/pages/details/details.component').then(c => c.DetailsComponent) },
      { path: 'products/cart', loadComponent: () => import('./features/products/pages/cart/cart.component').then(c => c.CartComponent), canActivate: [tokenGuard] },
      { path: 'services', loadComponent: () => import('./features/services/pages/services/services.component').then(c => c.ServicesComponent) },
      { path: 'services/schedule-service', loadComponent: () => import('./features/services/pages/appointment/appointment.component').then(c => c.AppointmentComponent), canActivate: [tokenGuard] },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component').then(c => c.LoginComponent), canActivate: [authenticatedGuard] },
      { path: 'register', loadComponent: () => import('./features/auth/pages/register/register.component').then(c => c.RegisterComponent), canActivate: [authenticatedGuard] },
      { path: 'auth-code', loadComponent: () => import('./features/auth/pages/auth-code/auth-code.component').then(c => c.AuthCodeComponent), canActivate: [authenticatedGuard] },
      { path: 'account-recovery', loadComponent: () => import('./features/auth/pages/recovery-account/recovery-account.component').then(c => c.RecoveryAccountComponent) },
      { path: 'new-password', loadComponent: () => import('./features/auth/pages/new-password/new-password.component').then(c => c.NewPasswordComponent) },
    ],
  },
  {
    path: 'dashboard',
    component: UserDashboardLayoutComponent,
    children: [
      { path: 'profile', loadComponent: () => import('./features/dashboard/pages/profile/profile.component').then(c => c.ProfileComponent) },
      { path: 'pets', loadComponent: () => import('./features/dashboard/pages/pets/pets.component').then(c => c.PetsComponent) },
      { path: 'adoption-list', loadComponent: () => import('./features/dashboard/pages/adoption-list/adoption-list.component').then(c => c.AdoptionListComponent) },
      { path: 'orders', loadComponent: () => import('./features/dashboard/pages/orders/orders.component').then(c => c.OrdersComponent) },
      { path: 'orders/detail/:id', loadComponent: () => import('./features/dashboard/pages/orden-detail/orden-detail.component').then(c => OrdenDetailComponent) },
      { path: 'favorites', loadComponent: () => import('./features/dashboard/pages/favorites/favorites.component').then(c => c.FavoritesComponent) },
      { path: 'reports', loadComponent: () => import('./features/dashboard/pages/reports/reports.component').then(c => c.ReportsComponent) },
      { path: 'appointments', loadComponent: () => import('./features/dashboard/pages/appointments/appointments.component').then(c => c.AppointmentsComponent) },
      { path: 'appointments/service/:id', loadComponent: () => import('./features/dashboard/pages/service-appointment-detail/service-appointment-detail.component').then(c => c.ServiceAppointmentDetailComponent) },
      { path: 'appointments/adoption/:id', loadComponent: () => import('./features/dashboard/pages/adoption-appointment-detail/adoption-appointment-detail.component').then(c => c.AdoptionAppointmentDetailComponent) },
    ],
  },
  { path:'bad-request', loadComponent: () => import('./features/errors/pages/not-found/not-found.component').then(c => c.NotFoundComponent) },
  { path: 'server-error', loadComponent: () => import('./features/errors/pages/server-error/server-error.component').then(c => c.ServerErrorComponent) },
  { path:'not-found', loadComponent: () => import('./features/errors/pages/not-found/not-found.component').then(c => c.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./features/errors/pages/not-found/not-found.component').then(c => c.NotFoundComponent), data: { code: 404 } },];
