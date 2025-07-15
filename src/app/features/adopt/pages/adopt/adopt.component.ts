import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';;
import { PetCardsComponent } from "../../../../shared/components/pet-cards/pet-cards.component";
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PetCardsComponent, NgSelectModule],
  templateUrl: './adopt.component.html',
  styleUrl: './adopt.component.css'
})
export class AdoptComponent {
  filtrosForm: FormGroup;
  razas = [
    { id: 1, nombre: 'Labrador' },
    { id: 2, nombre: 'Pitbull' },
    { id: 3, nombre: 'Pug' },
    { id: 4, nombre: 'Pastor Alemán' },
    { id: 5, nombre: 'Golden Retriever' },
    { id: 6, nombre: 'Husky' },
  ];
  
  razaSeleccionada: number[] = [];
  
  constructor(private fb: FormBuilder){
    this.filtrosForm = this.fb.group({
      razas: [[]]
    });
  }

  onSubmit() {
    if (this.filtrosForm.invalid) {
      this.filtrosForm.markAllAsTouched();
      return;
    }

    const data = this.filtrosForm.value;

    console.log('FORM VALUES:', data);
  }
}
