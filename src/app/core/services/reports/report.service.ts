import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = `${environment.apiUrlBase}reports/`
  }

  getReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getReport(index: any): Observable<any> {
    return this.http.get(`${this.baseUrl}show/${index}/`);
  }

  addReport(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  deleteReport(index: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}delete/${index}/`);
  }
}
