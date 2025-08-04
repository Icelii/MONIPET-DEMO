import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PetCardsComponent } from '../../../../shared/components/pet-cards/pet-cards.component';
import { ProductCardsComponent } from "../../../../shared/components/product-cards/product-cards.component";
import { CommonModule } from '@angular/common';
import { PetService } from '../../../../core/services/pets/pet.service';
import { first, take, timeout } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductService } from '../../../../core/services/products/product.service';
import { response } from 'express';
import { error } from 'console';
import { Product } from '../../../../core/interfaces/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PetCardsComponent, ProductCardsComponent, NgxSkeletonLoaderModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public pets = signal<any[]>([]);
  public products = signal<any[]>([]);
  loadingPets = signal(true);
  loadingProducts = signal(true);

  constructor(private router: Router, private petService: PetService, private productService: ProductService) {}

  ngOnInit(): void {
    this.getPets();
    this.getProducts();
  }

  getPets() {
    this.petService.getPets().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const allPets = response.data;
          const shuffled = allPets.sort(() => 0.5 - Math.random());
          const randomFour = shuffled.slice(0, 4);

          this.pets.set(randomFour);
          this.loadingPets.set(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.loadingPets.set(false);
      },
      complete: () => {}
    });
  }


  getProducts() {
    this.productService.getProducts().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const firstFour = response.data.slice(0, 4).map((product: any) => ({
            ...product,
            categoryNames: product.categories?.map((c: any) => c.category) ?? []
          }));
          this.products.set(firstFour);
          this.loadingProducts.set(false);
          //console.log('PRODUCTS:', this.products());
        }
      },
      error: (error) => {
        this.loadingProducts.set(false);
        console.log(error);
      }
    });
  }
}
