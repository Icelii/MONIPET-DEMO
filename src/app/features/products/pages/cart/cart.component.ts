import { Component, Input, model } from '@angular/core';
import { OrderResumeComponent } from '../../../../shared/components/order-resume/order-resume.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, OrderResumeComponent, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  name: string = 'Plato de comida';
  quantity = model(1);

  increment() {
    this.quantity.update((val) => val + 1);
  }

  decrement() {
    this.quantity.update((val) => Math.max(0, val - 1));
  }
}
