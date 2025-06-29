import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { AuthCodeComponent } from './features/auth/pages/auth-code/auth-code.component';
import { RecoveryAccountComponent } from './features/auth/pages/recovery-account/recovery-account.component';
import { NewPasswordComponent } from './features/auth/pages/new-password/new-password.component';
import { AccountVerifiedLayoutComponent } from './layouts/account-verified-layout/account-verified-layout.component';
import { ButtonAccountVerifyComponent } from './features/auth/components/button-account-verify/button-account-verify.component';
import { ButtonAccountFailComponent } from './features/auth/components/button-account-fail/button-account-fail.component';

export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'auth-code', component: AuthCodeComponent },
      { path: 'account-recovery', component: RecoveryAccountComponent },
      { path: 'new-password', component: NewPasswordComponent }
    ]
  },
  {
    path: '',
    component: AccountVerifiedLayoutComponent,
    children: [
      { path: 'verification-success', component: ButtonAccountVerifyComponent },
      { path: 'verification-fail', component: ButtonAccountFailComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
