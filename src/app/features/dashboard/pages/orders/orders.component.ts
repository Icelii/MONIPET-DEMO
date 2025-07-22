import { Component } from '@angular/core';
import { OrderCardComponent } from "../../components/order-card/order-card.component";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrderCardComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

}
