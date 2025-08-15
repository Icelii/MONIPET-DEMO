import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl: string;
  private baseCategoriesUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrlBase}service/`;
    this.baseCategoriesUrl = `${environment.apiUrlBase}type_service/`;
  }

  getServices(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getService(service_id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${service_id}`);
  }

  getServiceList(services: any[]): Observable<any> {
    return this.http.post<{data: any[]}>(`${this.baseUrl}list`, {serviceIds: services});
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.baseCategoriesUrl);
  }
}
