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
  private typeProductsUrl: string;
  private categoriesUrl: string;
  private commentsUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = `${environment.apiUrlBase}products/`;
    this.typeProductsUrl = `${environment.apiUrlBase}types_products`;
    this.categoriesUrl = `${environment.apiUrlBase}categories`;
    this.commentsUrl = `${environment.apiUrlBase}comments/`
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getProduct(product_id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${product_id}`);
  }

  getTypeProducts(): Observable<any> {
    return this.http.get<any>(`${this.typeProductsUrl}`);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.categoriesUrl}`);
  }

  getCart(cart: any[]): Observable<any> {
    return this.http.post<{data: any[]}>(`${this.baseUrl}list`, {productIds: cart});
  }

  getComments(id: any): Observable<any> {
    return this.http.get<any>(`${this.commentsUrl}${id}`);
  }

  addComment(data: any): Observable<any> {
    return this.http.post(`${this.commentsUrl}`, data);
  }
}
