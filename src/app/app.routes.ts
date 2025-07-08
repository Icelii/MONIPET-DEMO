import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { AuthCodeComponent } from './features/auth/pages/auth-code/auth-code.component';
import { RecoveryAccountComponent } from './features/auth/pages/recovery-account/recovery-account.component';
import { NewPasswordComponent } from './features/auth/pages/new-password/new-password.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { UserDashboardLayoutComponent } from './layouts/user-dashboard-layout/user-dashboard-layout.component';
import { AdoptComponent } from './features/adopt/pages/adopt/adopt.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'adopt', component: AdoptComponent }
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'auth-code', component: AuthCodeComponent },
      { path: 'account-recovery', component: RecoveryAccountComponent },
      { path: 'new-password', component: NewPasswordComponent },
    ],
  },
  {
    path: 'test',
    component: UserDashboardLayoutComponent,
    children: [],
  },
  { path: '**', redirectTo: '' },
];
