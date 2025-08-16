
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
  loading = signal(true);
  minToDate: string | null = null;

  //FILTROS
  statusFilter = signal<string>('todo');
  fromDateFilter = signal<string | null>(null);
  toDateFilter = signal<string | null>(null);
  searchFilter = signal<string>('');

  filteredOrders = computed(() => {
    const all = this.orders() || [];
    const status = this.statusFilter();
    const from = this.fromDateFilter();
    const to = this.toDateFilter();
    const search = this.searchFilter();

    const formatDate = (dateStr: string) => dateStr.split(' ')[0];

    return all.filter((app: any) => {
      let ok = true;

      if (status !== 'todo' && status) {
        ok = ok && app.status?.toLowerCase() === status.toLowerCase();
      }

      if (from) {
        ok = ok && formatDate(app.purchase_date) >= from;
      }

      if (to) {
        ok = ok && formatDate(app.purchase_date) <= to;
      }

      if (search) {
        //const searchId = Number(search);
        ok = ok && app.id.toString().includes(search);
      }

      return ok;
    });
  });

  // PAGINACION
  p = signal(1);
  perPage = 3;  

  paginatedOrders = computed(() => {
    const start = (this.p() - 1) * this.perPage;
    return this.filteredOrders().slice(start, start + this.perPage);
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredOrders().length / this.perPage)
  );

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.p.set(page);
    }
  }

  constructor(private ordenService: OrdenService) {
    effect(() => {
      const user = this.user();
    
      if (user?.id) {
        this.getOrders();
      }
    });
  }

  ngOnInit(): void {}

  onDateChange(event: Event, filter: 'from' | 'to') {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    if (filter === 'from') {
      this.fromDateFilter.set(input.value);

      const to = this.toDateFilter();
      if (to && to < input.value) {
        this.toDateFilter.set(input.value);
        (document.getElementById('toDate') as HTMLInputElement).value = input.value;
      }
    } else {
      this.toDateFilter.set(input.value);
    }

    this.p.set(1);
  }

  onSelectChange(event: Event, filter: 'status' | 'type') {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    if (filter === 'status') this.statusFilter.set(select.value);

    this.p.set(1);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.searchFilter.set(input.value);

    this.p.set(1);
  }

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
