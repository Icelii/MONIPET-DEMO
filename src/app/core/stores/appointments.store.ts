import { signal } from "@angular/core";

export const userAppointments = signal<any>([]);
export const appointmentDetail = signal<any>({});
export const selectedServices = signal<any>([]);

export function addServiceToSelection(id: number) {
  if (!selectedServices().includes(id)) {
    selectedServices.set([...selectedServices(), id]);
  }
}

export function removeServiceFromSelection(id: number) {
  selectedServices.set(selectedServices().filter((sid: any) => sid !== id));
}
