import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { addToProductCart, useProductCart } from '../../../core/stores/cart.store';
import { addTofavList, removeFromfavList, usefavList } from '../../../core/stores/favoriteProducts.store';
import { comments } from '../../../core/stores/comments.store';
import { ProductService } from '../../../core/services/products/product.service';
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cards.component.html',
  styleUrl: './product-cards.component.css'
})
export class ProductCardsComponent {
  isProductRoute: boolean = false;
  @Input() product_id!: number;
  @Input() name: string = "";
  @Input() price: number = 0;
  @Input() discount: number = 0;
  @Input() rate: number = 0;
  @Input() comments: number = 0;
  @Input() categories: string[] = [];
  @Input() photo_link: string = '';
  productComments: WritableSignal<any[]> = signal([]);
  priceDiscount: number = 0;
  loading = signal(true);

  cart = useProductCart;

  favs = usefavList();
  isInFavList = computed(() => this.favs().includes(this.product_id));

  constructor(private router: Router, private productService: ProductService, private authService: AuthService) {
    this.isProductRoute = this.router.url.includes('/products');
  }

  addToCartIfLoggedIn() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.addToCart();
    }
  }

  toggleFavIfLoggedIn() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.toggleFav();
    }
  }

  addToCart() {
    addToProductCart(this.product_id, 1);
  }
  
  toggleFav() {
    if (this.isInFavList()) {
      removeFromfavList(this.product_id);
    } else {
      addTofavList(this.product_id);
    }
  }

  ngOnChanges() {
    this.calculateDiscountedPrice();

    if (this.product_id) {
      this.getComments(this.product_id);
    }
  }
 
  private calculateDiscountedPrice() {
    if (this.discount > 0 && this.discount <= 100) {
      this.priceDiscount = this.price - (this.price * this.discount / 100);
    } else {
      this.priceDiscount = this.price;
    }
  }

  getComments(product_id: number) {
    this.productService.getComments(product_id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
         this.productComments.set(response.data);
         this.loading.set(false);
        } else {
          this.productComments.set([]);
          this.loading.set(false);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  get averageRating(): number {
    const list = this.productComments();

    if (!list.length) return 0;

    const total = list.reduce((acc: any, curr: any) => acc + (curr.rate || 0), 0);
    return parseFloat((total / list.length).toFixed(1));
  }

  goToDetails() {
    this.router.navigate(['/products/details', this.product_id])
  }
}
