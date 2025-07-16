import { CommonModule } from '@angular/common';
import { Component, Input, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cards.component.html',
  styleUrl: './product-cards.component.css'
})
export class ProductCardsComponent {
  isProductRoute: boolean = false;
  @Input() name: string = "";
  @Input() price: number = 0;
  @Input() discount: number = 0;
  @Input() comments: number = 0;
  @Input() categories: string[] = [];
  @Input() photo_link: string = "";
  priceDiscount: number = 0;

  constructor(private router: Router) {
    this.isProductRoute = this.router.url.includes('/products');
  }

  ngOnChanges() {
    this.calculateDiscountedPrice();
  }
 
  private calculateDiscountedPrice() {
    if (this.discount > 0 && this.discount <= 100) {
      this.priceDiscount = this.price - (this.price * this.discount / 100);
    } else {
      this.priceDiscount = this.price;
    }
  }
}
