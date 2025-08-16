import { Component, computed, effect, Input, model, OnInit, signal } from '@angular/core';
import { OrderResumeComponent } from '../../../../shared/components/order-resume/order-resume.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { clearCart, removeFromProductCart, updateProductQuantity, useProductCart } from '../../../../core/stores/cart.store';
import { ProductService } from '../../../../core/services/products/product.service';
import { take, timeout } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, OrderResumeComponent, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  items = useProductCart();
  productList = signal<any[]>([]);
  quantities = signal<{ [productId: string]: number }>({});
  selectedItems: Set<number> = new Set();
  selectAllChecked = false;

  //PAGINACION
  p = signal(1);
  perPage = 3; 

  paginatedItems = computed(() => {
    const start = (this.p() - 1) * this.perPage;
    return this.productList().slice(start, start + this.perPage);
  });

  totalPages = computed(() => 
    Math.ceil(this.productList().length / this.perPage)
  );

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.p.set(page);
    }
  }

  constructor(private productService: ProductService) {
    effect(() => {
      const cartItems = this.items();
      
      if (cartItems.length === 0) {
        this.productList.set([]);
        return;
      }

      this.getCart(cartItems);
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}
  
  increment(productId: number) {
    const currentQty = this.quantities()[productId] ?? 1;
    updateProductQuantity(productId, currentQty + 1);
  }

  decrement(productId: number) {
    const currentQty = this.quantities()[productId] ?? 1;
    updateProductQuantity(productId, Math.max(1, currentQty - 1));
  }

  getCart(cart: any[]) {
    const storeItems = this.items;

    this.productService.getCart(cart.map(item => item.id)).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        this.productList.set(response.data);

        this.selectedItems.clear();
        response.data.forEach((item: any) => this.selectedItems.add(item.id));
        this.selectAllChecked = true;

        const initialQuantities: { [key: string]: number } = {};

        for (const item of response.data) {
          const found = cart.find(c => c.id === item.id);
          initialQuantities[item.id] = found?.quantity ?? 1;
        }

        this.quantities.set(initialQuantities);
        //console.log('CARRITO: ', this.productList());
      },
      error: (error) => {
        console.log(error);
        this.productList.set([]);
        this.quantities.set({});
      }
    });
  }

  cleanCart() {
    clearCart();
    this.productList.set([]);
    this.quantities.set({});
    this.selectedItems.clear();
    this.selectAllChecked = false;
  }

  removeItem(id: number) {
    removeFromProductCart(id);
  }

  get total() {
    const totalValue = this.selectedProducts.reduce((acc, item) => {
      const qty = this.quantities()[item.id] || 1;
      const discountMultiplier = 1 - ((item.discount ?? 0) / 100);
      return acc + item.price * qty * discountMultiplier;
    }, 0);

    return Number(totalValue.toFixed(2));
  }

  get subTotal() {
    const subTotalValue = this.selectedProducts.reduce((acc, item) => {
      const qty = this.quantities()[item.id] || 1;
      return acc + item.price * qty;
    }, 0);

    return Number(subTotalValue.toFixed(2));
  }

  get discountTotal() {
    const subTotalValue = this.selectedProducts.reduce((acc, item) => {
      const qty = this.quantities()[item.id] || 1;
      return acc + item.price * qty;
    }, 0);

    const totalValue = this.selectedProducts.reduce((acc, item) => {
      const qty = this.quantities()[item.id] || 1;
      const discountMultiplier = 1 - ((item.discount ?? 0) / 100);
      return acc + item.price * qty * discountMultiplier;
    }, 0);

    return Number((subTotalValue - totalValue).toFixed(2));
  }

  toggleSelectAll() {
    this.selectAllChecked = !this.selectAllChecked;
    this.selectedItems.clear();

    if (this.selectAllChecked) {
      this.productList().forEach(item => this.selectedItems.add(item.id));
    }

    this.productList.set([...this.productList()]);
  }

  toggleItemSelection(id: number) {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }

    this.selectAllChecked = this.selectedItems.size === this.productList().length;

    this.productList.set([...this.productList()]);
  }

  get selectedCount() {
    return this.selectedItems.size;
  }

  get selectedProducts() {
    return this.productList().filter(item => this.selectedItems.has(item.id));
  }

  formatPrice(value: number): string {
    return value.toFixed(2);
  }

  get cartProductsData(): { id: number; quantity: number }[] {
    const selectedProds = this.selectedProducts;
    const quantities = this.quantities();
    
    console.log('Getter - Selected products:', selectedProds);
    console.log('Getter - Quantities:', quantities);
    
    return selectedProds.map(product => ({
      id: product.id,
      quantity: quantities[product.id] || 1
    }));
  }

  cartProductsSignal = computed(() => {
    const selectedProds = this.selectedProducts;
    const quantities = this.quantities();

    return selectedProds.map(product => {
      const qty = quantities[product.id] || 1;

      return {
        product_id: product.id,
        price: Number(product.price),
        discount: product.discount || 0,
        quantity: qty
      };
    });
  });
}
