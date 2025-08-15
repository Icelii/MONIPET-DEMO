import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private baseOrderUrl: string;
  private baseOrderDetailsUrl: string;

  constructor(private http: HttpClient) { 
    this.baseOrderUrl = `${environment.apiUrlBase}order/`;
    this.baseOrderDetailsUrl = `${environment.apiUrlBase}details_order/`
  }

  getOrders(idUser: number): Observable<any> {
    return this.http.get<any>(`${this.baseOrderUrl}user/${idUser}`);
  }

  getOrdenDetail(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseOrderDetailsUrl}${id}`);
  }

  cancelOrder(id: number, cancel: any): Observable<any> {
    return this.http.put(`${this.baseOrderUrl}${id}`, cancel);
  }

  getOrden(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseOrderUrl}${id}`);
  }
}
