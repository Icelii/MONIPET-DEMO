import { signal } from "@angular/core";
import userPetsList from '../../../../public/json/userPets.json';

export const pets = signal<any>([]);
export const userPets = signal<any>(userPetsList);
export const pet = signal<any>({});