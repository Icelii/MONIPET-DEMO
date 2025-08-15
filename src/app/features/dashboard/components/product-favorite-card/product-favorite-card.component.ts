import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { addToProductCart, useProductCart } from '../../../../core/stores/cart.store';

@Component({
  selector: 'app-product-favorite-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-favorite-card.component.html',
  styleUrl: './product-favorite-card.component.css'
})
export class ProductFavoriteCardComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() price!: number;
  @Input() discount!: number;
  @Input() comments!: number;
  @Input() photo_link: string = "";
  priceDiscount: number = 0;

  cart = useProductCart;

  constructor(private router: Router) {}

  ngOnChanges() {
    this.calculateDiscountedPrice();
  }

  addToCart() {
    addToProductCart(this.id, 1);
  }
 
  private calculateDiscountedPrice() {
    if (this.discount > 0 && this.discount <= 100) {
      this.priceDiscount = this.price - (this.price * this.discount / 100);
    } else {
      this.priceDiscount = this.price;
    }
  }

  goToDetails() {
    this.router.navigate(['/products/details', this.id])
  }
}
