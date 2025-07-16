import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductCardsComponent } from '../../../../shared/components/product-cards/product-cards.component';
import { PriceSliderComponent } from '../../components/price-slider/price-slider.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductCardsComponent,
    PriceSliderComponent
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  filtrosForm: FormGroup;
  dropdownOpen = false;
  options = [false, false, false];

    categorias = [
    {
      nombre: 'Categoría',
      open: false,
      opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
      seleccionadas: [false, false, false]
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
