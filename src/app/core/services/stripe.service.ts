import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private baseUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = `${environment.apiUrlBase}stripe/`;
    this.stripePromise = loadStripe('pk_test_51RuAjz1vjin9fOqQn3uIUMJiDQlMQclQFUla2BhPPg8lVcw2IDc8moxAx2zASlsIlecYVv71yAx4EgvzjFr3uDke00Hgi0uXym');
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  createPaymentIntent(amount: number, metadata: any): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.baseUrl}create-payment-intent`, { amount, metadata });
  }

  confirmPayment(paymentIntentId: string, payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}confirm-payment`, { paymentIntentId, ...payload });
  }
}
