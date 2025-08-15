import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseAppointmentUrl: string;
  private baseAppointmentDetailUrl: string;
  private basePetAppointmentUrl: string;

  constructor(private http: HttpClient) {
    this.baseAppointmentUrl = `${environment.apiUrlBase}appointment/`;
    this.baseAppointmentDetailUrl = `${environment.apiUrlBase}appointment_details/`;
    this.basePetAppointmentUrl = `${environment.apiUrlBase}appointment_pets`;
  }

  getAppointments(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseAppointmentUrl}user/${userId}`);
  }

  getAppointment(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseAppointmentUrl}${id}`);
  }

  cancelAppointment(id: number, cancel: any): Observable<any> {
    return this.http.put(`${this.baseAppointmentUrl}${id}`, cancel);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseAppointmentDetailUrl}${id}`);
  }

  scheduleAdoption(data: any): Observable<any> {
    return this.http.post(`${this.baseAppointmentUrl}`, data);
  }

  appointmentPets(pets: any): Observable<any> {
    return this.http.post<{data: any[]}>(`${this.basePetAppointmentUrl}`, pets);
  }
}
