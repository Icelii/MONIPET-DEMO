import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
})
export class ServiceCardComponent implements OnInit, OnDestroy {
  @Input() service_id!: number;
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() discounts: number = 0;
  @Input() typeService: string = '';
  @Input() medical!: number;
  @Input() desc: string = '';
  priceDiscount: number = 0;
  @Input() isSelected = false;
  @Output() selectionChange = new EventEmitter<{ id: number; selected: boolean }>();

  constructor() {}

  ngOnInit() {
    this.calculateDiscountedPrice();
  }

  toggleButtonSelection() {
    this.isSelected = !this.isSelected;
    this.selectionChange.emit({ id: this.service_id, selected: this.isSelected });
  }

  private calculateDiscountedPrice() {
    if (this.discounts > 0 && this.discounts <= 100) {
      this.priceDiscount = this.price - (this.price * this.discounts / 100);
    } else {
      this.priceDiscount = this.price;
    }
  }

  ngOnDestroy() {
    if (this.isSelected) {
      this.selectionChange.emit({ id: this.service_id, selected: false });
    }
  }
}
