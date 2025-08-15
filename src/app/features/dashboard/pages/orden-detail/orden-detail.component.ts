import { Component, model, signal } from '@angular/core';
import { OrderResumeComponent } from '../../../../shared/components/order-resume/order-resume.component';
import { TransferCodeComponent } from "../../components/transfer-code/transfer-code.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdenService } from '../../../../core/services/orders/orden.service';
import { take, timeout } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-orden-detail',
  standalone: true,
  imports: [CommonModule, OrderResumeComponent, TransferCodeComponent, LoaderElementsComponent, NgxPaginationModule],
  templateUrl: './orden-detail.component.html',
  styleUrl: './orden-detail.component.css',
})
export class OrdenDetailComponent {
  orderId!: number;
  order: any = {};
  p: number = 1;
  loading = signal(true);

  constructor(private route: ActivatedRoute, private ordenService: OrdenService) {}

  ngOnInit() {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.getOrder();
  }

  getOrder() {
    this.ordenService.getOrden(this.orderId).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.order = response.data;
          this.loading.set(false);
        } else {
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  getSubtotal(detail: any): number {
    const price = Number(detail.price);
    const quantity = Number(detail.quantity);
    return price * quantity;
  }

  getSubtotalSinDescuento(details: any[]): number {
    return details.reduce((acc, item) => {
      const precioBase = Number(item.product.price);
      const cantidad = Number(item.quantity);
      return acc + precioBase * cantidad;
    }, 0);
  }

  getDescuentoAplicado(details: any[], totalConDescuento: number): number {
    const subtotal = this.getSubtotalSinDescuento(details);
    return subtotal - totalConDescuento;
  }
}
