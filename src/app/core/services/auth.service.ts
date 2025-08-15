import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { checkPassword, data2FA, LoginData, RegisterData } from '../../core/interfaces/user'
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { currentUser } from '../stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;
  private token: string | null = null;
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { 
    this.baseUrl = `${environment.apiUrlBase}auth/`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  register(registerData: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}register`, registerData);
  }

  login(LoginData: LoginData): Observable<any> {
    return this.http.post(`${this.baseUrl}login`, LoginData);
  }

  verifyCode(data2FA: data2FA): Observable<any> {
    return this.http.post(`${this.baseUrl}2fa/verify`, data2FA);
  }

  saveToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (this.isBrowser) {
      this.token = localStorage.getItem('auth_token');
    } else {
      this.token = null;
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}logout`, '').pipe(
      tap(() => {
        if (this.isBrowser) {
          localStorage.removeItem('auth_token');
          this.token = null;
          currentUser.set(null);
        }
      })
    );
  }

  getUserInfo() {
    this.http.get<any>(`${this.baseUrl}me`).subscribe({
      next: (response) => {
        if (response.result) {
          currentUser.set(response.data);
        } else {
          currentUser.set(null);
        }
      },
      error: (error) => {
        currentUser.set(null);
        //console.warn('No hay sesión iniciada o error en /me', error);
      }
    });
  }

  checkPassword(password: checkPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}verify_password`, password);
  }

  resendEmailVerification(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}email/resend-verification`, {email: email});
  }

  send2FACode(email: any): Observable<any> {
    return this.http.post(`${this.baseUrl}2fa/send`, {email: email});
  }

  recoveryPass(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}recovery-pass`, data);
  }
}
