import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { updateUserData } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrlBase}user/`;
  }

  updateUserInfo(id: number, userData: updateUserData): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}`, userData);
  }

  getNotifications(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlBase}notifications`);
  }

  markAsRead(id: string) {
    return this.http.post(`${environment.apiUrlBase}notifications/${id}/read`, {});
  }
}
