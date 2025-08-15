import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductCardsComponent } from '../../../../shared/components/product-cards/product-cards.component';
import { PriceSliderComponent } from '../../components/price-slider/price-slider.component';
import { ProductService } from '../../../../core/services/products/product.service';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { take, timeout, TimeoutError } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { HttpErrorResponse } from '@angular/common/http';

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

  //PARA FILTROS
  categoriasAgrupadas: any[] = [];
  searchText = signal('');
  filteredProducts = signal<any[]>([]);
  precioFiltro: [number, number] = [0, 1000];
  appliedFilters: { categorias: string[], precio: [number, number] } = { categorias: [], precio: [0, 1000] };
  @ViewChild('resultados') resultadosRef!: ElementRef;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.filtrosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this.productService.getProducts().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const filteredProducts = response.data.filter((product: any) => product.stock > 0);
          this.products = filteredProducts;

          this.filteredProducts.set([...this.products]);

          this.loading.set(false);
        } else {
          this.products = [];
          this.filteredProducts.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.log(error);
        this.products = [];
        this.filteredProducts.set([]);
        this.loading.set(false);
      }
    });
  }

  toggleDropdown(index: number) {
    this.categoriasAgrupadas[index].open = !this.categoriasAgrupadas[index].open;
  }

  onCheck(groupIndex: number, catIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.categoriasAgrupadas[groupIndex].categorias[catIndex].seleccionada = input.checked;
  }

  getCategories() {
    this.productService.getCategories().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const grouped: { [key: string]: { nombre: string; seleccionada: boolean }[] } = {};

          response.data.forEach((cat: any) => {
            const tipo = cat.type_category.type_category;
            if (!grouped[tipo]) grouped[tipo] = [];
            grouped[tipo].push({ nombre: cat.category, seleccionada: false });
          });

          this.categoriasAgrupadas = Object.keys(grouped).map(tipo => ({
            tipo,
            categorias: grouped[tipo],
            open: false
          }));
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        console.log(error);
      }
    });
  }

  onPriceChange(values: [number, number]) {
    this.precioFiltro = values;
  }
  
  onSubmit() {
    const selectedCategories = this.categoriasAgrupadas
      .flatMap(g => g.categorias.filter((c: any) => c.seleccionada).map((c: any) => c.nombre));

    this.appliedFilters = {
      categorias: selectedCategories,
      precio: this.precioFiltro
    };

    this.applyFilters();

    setTimeout(() => {
      this.resultadosRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  onSearchChange(text: string) {
    this.searchText.set(text);
    this.applySearch();
  }

  applySearch() {
    const text = this.searchText().toLowerCase().trim();

    this.filteredProducts.set(
      this.products.filter(product =>
        !text || product.name.toLowerCase().includes(text)
      )
    );
  }

  applyFilters() {
    const { categorias, precio } = this.appliedFilters;
    const [minPrice, maxPrice] = precio;

    this.filteredProducts.set(
      this.products.filter(product => {
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesCategory = categorias.length === 0 || 
          (product.categories ?? []).some((c: any) => categorias.includes(c.category));
        return matchesPrice && matchesCategory;
      })
    );
  }
}
