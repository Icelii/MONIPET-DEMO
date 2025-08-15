import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { OrderCardComponent } from "../../components/order-card/order-card.component";
import { userOrders } from '../../../../core/stores/orders.store';
import { OrdenService } from '../../../../core/services/orders/orden.service';
import { currentUser } from '../../../../core/stores/auth.store';
import { take, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, NgxPaginationModule, LoaderElementsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  user = computed(() => currentUser());
  orders = computed(() => userOrders());
  p: number = 1;
  loading = signal(true);
  searchText = signal('');

  allOrders = computed(() => {
    const orders = this.orders();
    if (!orders) return [];

    return orders.map((order: any) => {
      const totalQuantity = order.details.reduce((acc: number, detail: any) => acc + detail.quantity, 0);
      return {
        ...order,
        totalQuantity
      };
    });
  });

  constructor(private ordenService: OrdenService) {
    effect(() => {
      const user = this.user();
    
      if (user?.id) {
        this.getOrders();
      }
    });
  }

  ngOnInit(): void {}

  getOrders() {
    this.ordenService.getOrders(this.user().id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          userOrders.set(response.data);
          this.loading.set(false);
        } else {
          userOrders.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        userOrders.set([]);
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  getTwoRandomPhotos(order: any): string[] {
    const allPhotos = order.details.flatMap((detail: any) =>
      detail.product.product_photos.map((photo: any) => photo.photo_link)
    );

    if (allPhotos.length <= 2) {
      return allPhotos;
    }

    const selectedPhotos: string[] = [];
    while (selectedPhotos.length < 2) {
      const randomIndex = Math.floor(Math.random() * allPhotos.length);
      const photo = allPhotos[randomIndex];
      if (!selectedPhotos.includes(photo)) {
        selectedPhotos.push(photo);
      }
    }

    return selectedPhotos;
  }
}
