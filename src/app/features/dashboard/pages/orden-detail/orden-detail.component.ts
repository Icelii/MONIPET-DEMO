import { Component, model } from '@angular/core';
import { OrderResumeComponent } from '../../../../shared/components/order-resume/order-resume.component';
import { TransferCodeComponent } from "../../components/transfer-code/transfer-code.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orden-detail',
  standalone: true,
  imports: [CommonModule, OrderResumeComponent, TransferCodeComponent],
  templateUrl: './orden-detail.component.html',
  styleUrl: './orden-detail.component.css',
})
export class OrdenDetailComponent {
  name: string = 'Plato de comida';
  quantity = model(1);

  increment() {
    this.quantity.update((val) => val + 1);
  }

  decrement() {
    this.quantity.update((val) => Math.max(0, val - 1));
  }
}
