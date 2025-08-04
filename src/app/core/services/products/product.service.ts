import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = `${environment.apiUrlBase}products/`;
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getProduct(product_id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${product_id}`);
  }

}
