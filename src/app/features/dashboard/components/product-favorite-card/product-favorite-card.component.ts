import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-favorite-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-favorite-card.component.html',
  styleUrl: './product-favorite-card.component.css'
})
export class ProductFavoriteCardComponent {
  @Input() name: string = "";
  @Input() price: number = 0;
  @Input() discount: number = 0;
  @Input() comments: number = 0;
  @Input() categories: string[] = [];
  @Input() photo_link: string = "";
  priceDiscount: number = 0;

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
