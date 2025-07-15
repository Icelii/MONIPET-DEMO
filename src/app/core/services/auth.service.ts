import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { RegisterData } from '../../core/interfaces/user'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;


  constructor(private http: HttpClient) { 
    this.baseUrl = `${environment.apiUrlBase}auth/`;
  }

  register(registerData: RegisterData) {
    return this.http.post(`${this.baseUrl}register`, registerData);
  }
}
