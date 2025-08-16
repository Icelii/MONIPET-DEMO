import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { ProductFavoriteCardComponent } from "../../components/product-favorite-card/product-favorite-card.component";
import { clearfavList, usefavList } from '../../../../core/stores/favoriteProducts.store';
import { ProductService } from '../../../../core/services/products/product.service';
import { take, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ProductFavoriteCardComponent, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favs = usefavList();
  favProducts = signal<any[]>([]);
  loading = signal(true);

  //FILTRO
  searchFilter = signal<string>('');

  filteredFavorites = computed(() => {
    const all = this.favProducts() || [];
    const search = this.searchFilter().toLowerCase().trim();

    return all.filter((app: any) => {
      let ok = true;

      if (search) {
        ok = ok && app.name.toLowerCase().includes(search);
      }

      return ok;
    });
  });

  // FILTROS
    p = signal(1);
    perPage = 8;  

    paginatedFavorites = computed(() => {
      const start = (this.p() - 1) * this.perPage;
      return this.filteredFavorites().slice(start, start + this.perPage);
    });

    totalPages = computed(() => 
      Math.ceil(this.filteredFavorites().length / this.perPage)
    );

    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages()) {
        this.p.set(page);
      }
    }

  constructor(private productService: ProductService) {
    effect(() => {
      const favsList = this.favs();

      if (favsList.length === 0) {
        this.favProducts.set([])
        this.loading.set(false);
        return;
      }

      this.getFavs(favsList);
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}

  getFavs(products: any[]) {
    this.productService.getCart(products).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.favProducts.set(response.data);
          this.loading.set(false);
        } else {
          this.favProducts.set([]);
          this.loading.set(false);
        }
      }, 
      error: (error) => {
        this.favProducts.set([]);
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.searchFilter.set(input.value);
  }

  cleanFavList() {
    clearfavList();
  }
}
