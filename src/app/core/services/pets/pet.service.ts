import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { PetBase, storePetData } from '../../interfaces/pet';

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

  getUserPets(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}adopter/${id}`);
  }

  addPet(petData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, petData);
  }

  editPet(id: number, petData: storePetData): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}`, petData);
  }

  updatePetPhoto(id: number, photo: any): Observable<any> {
    return this.http.post(`${environment.apiUrlBase}pet_photos/${id}`, photo);
  }

  deletePet(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}`);
  }

  adoptionList(ids: any[]): Observable<any> {
    return this.http.post<{data: any[]}>(`${this.baseUrl}list`, {petIds: ids});
  }
}
