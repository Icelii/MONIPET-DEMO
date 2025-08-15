import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PetService } from '../../../../core/services/pets/pet.service';
import { timeout } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { addToAdoptionCart, removeFromAdoptionCart, useAdoptionCart } from '../../../../core/stores/adoptionList.store';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderElementsComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  petId!: number;
  petInfo: any = {};
  edad: string = ''; 
  loading = signal(true);

  cartIds = useAdoptionCart();
  isInCart = computed(() => this.cartIds().includes(this.petId));

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private petService: PetService) {}

  ngOnInit() {
    this.petId = +this.route.snapshot.paramMap.get('id')!;

    this.getPet();
  }

  toggleCartIfLoggedIn() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.toggleCart();
    }
  }

  toggleCart() {
    if (this.isInCart()) {
      removeFromAdoptionCart(this.petId);
    } else {
      addToAdoptionCart(this.petId);
    }
  }

  getPet() {
    this.petService.getPet(this.petId).pipe(timeout(1500)).subscribe({
      next: (response) => {
        if (response.result) {
          this.petInfo = response.data;

          if (this.petInfo.birthday) {
            this.edad = this.calculateAge(this.petInfo.birthday);
          }
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.log(error);
        this.loading.set(false);
      }
    });
  }

  calculateAge(birthday: string): string {
    const birthDate = new Date(birthday);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();

    if (days < 0) months--;
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) return `${years} año${years === 1 ? '' : 's'}`;
    if (months > 0) return `${months} mes${months === 1 ? '' : 'es'}`;
    return 'Recién nacido';
  }
  
  goToScheduleAdoption() {
    this.router.navigate(['/adopt/schedule-adoption'], {
      queryParams: { pets: JSON.stringify([this.petId]) }
    });
  }
}
