import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { addToAdoptionCart, removeFromAdoptionCart, useAdoptionCart } from '../../../core/stores/adoptionList.store';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pet-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pet-cards.component.html',
  styleUrl: './pet-cards.component.css'
})
export class PetCardsComponent {
  @Input() pet_id!: number;
  @Input() name!: string;
  @Input() gender!: string;
  @Input() birthday!: string;
  @Input() photo_link!: string;
  isAdoptRoute: boolean = false;
  age: string = ''; 

  cartIds = useAdoptionCart();
  isInCart = computed(() => this.cartIds().includes(this.pet_id));

  constructor(private router: Router, private authService: AuthService) {
    this.isAdoptRoute = this.router.url.includes('/adopt');
  }

  ngOnInit() {
    if(this.birthday) {
      this.age = this.calculateAge(this.birthday);
    }
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
      removeFromAdoptionCart(this.pet_id);
    } else {
      addToAdoptionCart(this.pet_id);
    }
  }

  calculateAge(birthday: string): string {
    const birthDate = new Date(birthday);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0) {
      return `${years} año${years === 1 ? '' : 's'}`;
    } else if (months > 0) {
      return `${months} mes${months === 1 ? '' : 'es'}`;
    } else {
      return 'Recién nacido';
    }
  }

  goToDetails() {
    this.router.navigate(['/adopt/details', this.pet_id]);
  }
}
