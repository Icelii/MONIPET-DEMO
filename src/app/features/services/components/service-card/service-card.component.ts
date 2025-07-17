import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
})
export class ServiceCardComponent {
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() discounts: number = 0;
  @Input() typeService: string = '';
  @Input() medical: boolean = false;
  @Input() desc: string = '';
  priceDiscount: number = 0;

  ngOnInit() {
    this.calculateDiscountedPrice();
  }

  private calculateDiscountedPrice() {
    if (this.discounts > 0 && this.discounts <= 100) {
      this.priceDiscount = this.price - (this.price * this.discounts) / 100;
    } else {
      this.priceDiscount = this.price;
    }
  }
}
