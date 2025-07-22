import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appointment-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-service-card.component.html',
  styleUrl: './appointment-service-card.component.css'
})
export class AppointmentServiceCardComponent {
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() discounts: number = 0;
  @Input() typeService: string = '';
  priceDiscount: number = 0;
  
  ngOnInit() {
    this.calculateDiscountedPrice();
  }

  private calculateDiscountedPrice() {
    if (this.discounts > 0 && this.discounts <= 100) {
      this.priceDiscount = this.price - (this.price * this.discounts / 100);
    } else {
      this.priceDiscount = this.price;
    }
  }
}
