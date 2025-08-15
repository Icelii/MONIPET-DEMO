import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PetCardsComponent } from '../../../../shared/components/pet-cards/pet-cards.component';
import { ProductCardsComponent } from "../../../../shared/components/product-cards/product-cards.component";
import { CommonModule } from '@angular/common';
import { PetService } from '../../../../core/services/pets/pet.service';
import { take, timeout, TimeoutError } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductService } from '../../../../core/services/products/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
          const notAdopted = allPets.filter((pet: any) => pet.status === 'No adoptado');
          const shuffled = notAdopted.sort(() => 0.5 - Math.random());
          const randomFour = shuffled.slice(0, 4);

          this.pets.set(randomFour);
          this.loadingPets.set(false);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.getPets();
          return;
        }

        const errResponse = error as HttpErrorResponse;
        const msg = errResponse.error?.msg || 'Ha ocurrido un error inesperado';
        const code = errResponse.error?.code;

         if (code !== 1201) { 
            Swal.fire({
              title: "Ocurrió un error! :(",
              text: msg,
              icon: "error",
              confirmButtonColor: "#489dba",
              confirmButtonText: "Cerrar",
            })
         }

        this.loadingPets.set(false);
      }
    });
  }

  getProducts() {
    this.productService.getProducts().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          const availableProducts = response.data.filter((product: any) => product.stock > 0);

          const shuffled = availableProducts.sort(() => Math.random() - 0.5);

          const firstFour = shuffled.slice(0, 4).map((product: any) => ({
            ...product,
            categoryNames: product.categories?.map((c: any) => c.category) ?? []
          }));

          this.products.set(firstFour);
          this.loadingProducts.set(false);
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError) {
          this.getProducts();
          return;
        }
        
        const errResponse = error as HttpErrorResponse;
        const msg = errResponse.error?.msg || 'Ha ocurrido un error inesperado';
        const code = errResponse.error?.code;

         if (code !== 1201) { 
            Swal.fire({
              title: "Ocurrió un error! :(",
              text: msg,
              icon: "error",
              confirmButtonColor: "#489dba",
              confirmButtonText: "Cerrar",
            })
         }

        this.loadingProducts.set(false);
      }
    });
  }
}
