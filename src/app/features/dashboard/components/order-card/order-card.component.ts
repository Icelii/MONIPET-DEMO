import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css'
})
export class OrderCardComponent {
  @Input() id: number = 0;
  @Input() purchase_date: string = '';
  @Input() price: number = 0;
  @Input() status: string = '';
  @Input() quantity: number = 0;
  @Input() producto_id: number = 0;
}
