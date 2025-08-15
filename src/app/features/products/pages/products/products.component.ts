import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductCardsComponent } from '../../../../shared/components/product-cards/product-cards.component';
import { PriceSliderComponent } from '../../components/price-slider/price-slider.component';
import { ProductService } from '../../../../core/services/products/product.service';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { take, timeout } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProductCardsComponent, PriceSliderComponent, NgxPaginationModule, LoaderElementsComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filtrosForm: FormGroup;
  dropdownOpen = false;
  p: number = 1;
  loading = signal(true);

  options = [false, false, false];

    categorias = [
    {
      nombre: 'Categoría',
      open: false,
      opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
      seleccionadas: [false, false, false]
    },
  ];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.filtrosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.getProducts();
  }

  onSubmit() {}

  getProducts() {
    this.productService.getProducts().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const filteredProducts = response.data.filter((product: any) => product.stock > 0);
          this.products = filteredProducts;
          this.loading.set(false);
        } else {
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.log(error);
        this.loading.set(false);
      }
    });
  }

  toggleDropdown(index: number) {
    this.categorias[index].open = !this.categorias[index].open;
  }

  onCheck(catIndex: number, optIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.categorias[catIndex].seleccionadas[optIndex] = input.checked;
  }
}
