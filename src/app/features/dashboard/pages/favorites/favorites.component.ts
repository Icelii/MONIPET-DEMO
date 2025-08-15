import { Component, effect, OnInit, signal } from '@angular/core';
import { ProductFavoriteCardComponent } from "../../components/product-favorite-card/product-favorite-card.component";
import { clearfavList, usefavList } from '../../../../core/stores/favoriteProducts.store';
import { ProductService } from '../../../../core/services/products/product.service';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ProductFavoriteCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favs = usefavList();
  favProducts = signal<any[]>([]);
  loading = signal(true);

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

  cleanFavList() {
    clearfavList();
  }
}
