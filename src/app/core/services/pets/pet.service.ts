import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { PetBase } from '../../interfaces/pet';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private baseUrl: string;
  
  constructor(private http: HttpClient) { 
    this.baseUrl = `${environment.apiUrlBase}pets/`;
  }

  getPets(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getPet(pet_id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${pet_id}`);
  }

  getTypesPet(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlBase}types_pet`);
  }

  getBreeds(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlBase}breeds`);
  }
}
