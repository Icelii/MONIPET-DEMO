import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';;
import { PetCardsComponent } from "../../../../shared/components/pet-cards/pet-cards.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { PetService } from '../../../../core/services/pets/pet.service';
import { take, timeout } from 'rxjs';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PetCardsComponent, NgSelectModule, LoaderElementsComponent, NgxPaginationModule],
  templateUrl: './adopt.component.html',
  styleUrl: './adopt.component.css'
})
export class AdoptComponent {
  pets: any[] = [];
  filteredPets: any[] = [];
  filteredPetsAfterSubmit: any[] = [];
  typesPet: any[] = [];
  filtrosForm: FormGroup;
  breeds: any[] = [];
  loading = signal(true);
  p: number = 1;
  edadOptions = ['Cachorro', 'Joven', 'Adulto', 'Senior'];
  generoOptions = ['Macho', 'Hembra', 'Desconocido'];
  submitted = false;
  @ViewChild('resultados') resultadosRef!: ElementRef;
  
  constructor(private fb: FormBuilder, private route: Router, private petService: PetService){
    this.filtrosForm = this.fb.group({
      generos: [[]],
      tipos: [[]],
      razas: [[]],
      edades: [[]],
    });
  }

  ngOnInit() {
    this.getTypesPet();
    this.getPets();
    this.getBreeds();
  }

  getAgeCategory(birthday: string): string {
    if (!birthday) return 'Desconocido';

    const birthDate = new Date(birthday);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());

    if (ageInMonths < 6) return 'Cachorro';
    if (ageInMonths < 24) return 'Joven';
    if (ageInMonths < 84) return 'Adulto';
    return 'Senior';
  }

  getPets() {
    this.petService.getPets().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.pets = response.data.filter((pet: any) => pet.status === 'No adoptado');
          this.loading.set(false);
          this.filteredPets = [...this.pets];
        }
      },
      error: (error) => {
        console.log(error);
        this.loading.set(false);
      }
    });
  }

  getTypesPet() {
    this.petService.getTypesPet().pipe(timeout(15000)).subscribe({
      next: (response) => {
        if (response.result) {
          this.typesPet = response.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getBreeds() {
    this.petService.getBreeds().pipe(timeout(15000)).subscribe({
      next: (response) => {
        if (response.result) {
          this.breeds = response.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  filtroActivo(): boolean {
    const { generos, tipos, razas, edades } = this.filtrosForm.value;
    return (
      generos.length > 0 ||
      tipos.length > 0 ||
      razas.length > 0 ||
      edades.length > 0
    );
  }

  applyFilters() {
    const { generos, tipos, razas, edades } = this.filtrosForm.value;

    this.filteredPets = this.pets.filter(pet => {
      if (
        generos?.length &&
        !generos.some((g: string) => g.toLowerCase().trim() === (pet.gender || '').toLowerCase().trim())
      ) return false;

      if (
        tipos?.length &&
        !tipos.includes(pet.breed?.type_pet?.type_pet)
      ) return false;

      if (
        razas?.length &&
        !razas.includes(pet.breed?.id)
      ) return false;

      if (edades?.length) {
        const ageCat = this.getAgeCategory(pet.birthday);
        if (!edades.some((e: string) => e.toLowerCase().trim() === ageCat.toLowerCase().trim())) return false;
      }

      return true;
    });

    this.p = 1;
  }

  onSubmit() {
    if (this.filtrosForm.invalid) {
      this.filtrosForm.markAllAsTouched();
      return;
    }

    this.submitted = true;
    this.applyFilters();

    this.filteredPetsAfterSubmit = [...this.filteredPets];

    setTimeout(() => {
      this.resultadosRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  toggleSelection(controlName: string, value: string, event: Event) {
    const control = this.filtrosForm.get(controlName);
    if (!control) return;

    const currentValue: string[] = control.value || [];
    const input = event.target as HTMLInputElement;

    if (input.checked) {
      if (!currentValue.includes(value)) {
        control.setValue([...currentValue, value]);
      }
    } else {
      control.setValue(currentValue.filter(v => v !== value));
    }
  } 
}
