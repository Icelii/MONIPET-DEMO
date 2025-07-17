import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceCardComponent } from "../../components/service-card/service-card.component";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ServiceCardComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  filtrosForm: FormGroup;
  dropdownOpen = false;
  options = [false, false, false];

  categorias = [
    {
      nombre: 'Categoría',
      open: false,
      opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
      seleccionadas: [false, false, false],
    },
  ];

  constructor(private fb: FormBuilder) {
    this.filtrosForm = this.fb.group({});
  }

  ngOnInit() {}

  onSubmit() {}

  toggleDropdown(index: number) {
    this.categorias[index].open = !this.categorias[index].open;
  }

  onCheck(catIndex: number, optIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.categorias[catIndex].seleccionadas[optIndex] = input.checked;
  }
}
