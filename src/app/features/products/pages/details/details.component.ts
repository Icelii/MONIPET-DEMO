import { CommonModule } from '@angular/common';
import { Component, computed, Input, model, signal } from '@angular/core';
import { CommentCardComponent } from "../../components/comment-card/comment-card.component";
import { StarRatingComponent } from "../../components/star-rating/star-rating.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../core/services/products/product.service';
import { take, timeout, TimeoutError } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { addToProductCart, useProductCart } from '../../../../core/stores/cart.store';
import { addTofavList, removeFromfavList, usefavList } from '../../../../core/stores/favoriteProducts.store';
import { currentUser } from '../../../../core/stores/auth.store';
import { comments } from '../../../../core/stores/comments.store';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from "../../../../shared/components/error-messages/error-messages.component";
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, CommentCardComponent, StarRatingComponent, LoaderElementsComponent, NgxPaginationModule, ErrorMessagesComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @Input() comments: number = 0;
  productId!: number;
  product: any = {};
  quantity = model(1);
  priceDiscount = signal<number>(0);
  loading = signal(true);
  loadingComments = signal(true);
  p: number = 1;
  productComments = computed(() => comments());
  commentForm: FormGroup;
  userRating: number = 0;

  cart = useProductCart;

  favs = usefavList();
  isInFavList = computed(() => this.favs().includes(this.productId));
  
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private productService: ProductService, private fb: FormBuilder){
    this.commentForm = this.fb.group({
      product_id: [''],
      title: ['', [Validators.required, Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú0-9.,¡!¿?()\"'\\s-]*$"), Validators.minLength(3), Validators.maxLength(100)]],
      rate: [''],
      comment: ['', [Validators.required, Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú0-9.,¡!¿?()\"'\\s-]*$"), Validators.minLength(20), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    this.getProduct();
    this.getComments();
  }

  getControl(name: string): AbstractControl {
      return this.commentForm.controls[name];
  }

  getProduct() {
    this.productService.getProduct(this.productId).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.product = response.data;
          this.calculateDiscountedPrice();
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

  getComments() {
    this.productService.getComments(this.productId).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          comments.set(response.data);
          this.loadingComments.set(false);
        } else {
          comments.set([]);
          this.loadingComments.set(false);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        console.log(error);
      }
    });
  }

  increment() {
    this.quantity.update((val) => val + 1);
  }

  decrement() {
    this.quantity.update((val) => Math.max(0, val - 1));
  }

  get discountInteger(): number {
    return Math.floor(+this.product.discount);
  }

  private calculateDiscountedPrice() {
    const price = parseFloat(this.product.price);
    const discount = parseFloat(this.product.discount);

    if (discount > 0 && discount <= 100) {
      const discountedPrice = price - (price * discount / 100);
      const rounded = parseFloat(discountedPrice.toFixed(2));
      this.priceDiscount.set(rounded);
    } else {
      const rounded = parseFloat(price.toFixed(2));
      this.priceDiscount.set(rounded);
    }
  }

  addToCartIfLoggedIn() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.addToCart();
    }
  }

  toggleFavIfLoggedIn() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.toggleFav();
    }
  }

  addToCart() {
    addToProductCart(this.productId, this.quantity());
  }
    
  toggleFav() {
    if (this.isInFavList()) {
      removeFromfavList(this.productId);
    } else {
      addTofavList(this.productId);
    }
  }

  sendReview() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    
    this.commentForm.patchValue({
      product_id: this.productId,
      rate: this.userRating
    });

    const data = this.commentForm.value;
    
    this.productService.addComment(data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          Swal.fire({
            title: "Reseña enviada!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then((result) => {
              this.getComments();
          });
        }
      },
      error: (error) => {
        console.log(error);
      } 
    });
  }

  get averageRating(): number {
    const list = comments();

    if (!list.length) return 0;

    const total = list.reduce((acc: any, curr: any) => acc + (curr.rate || 0), 0);
    return parseFloat((total / list.length).toFixed(1));
  }
}
