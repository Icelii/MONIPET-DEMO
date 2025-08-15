import { Component, effect, OnInit, signal } from '@angular/core';
import { PetCardComponent } from "../../components/pet-card/pet-card.component";
import { PetService } from '../../../../core/services/pets/pet.service';
import { take, timeout } from 'rxjs';
import { addToAdoptionCart, clearAdoptionCart, removeFromAdoptionCart, useAdoptionCart } from '../../../../core/stores/adoptionList.store';
import { CommonModule } from '@angular/common';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adoption-list',
  standalone: true,
  imports: [CommonModule, PetCardComponent, LoaderElementsComponent],
  templateUrl: './adoption-list.component.html',
  styleUrl: './adoption-list.component.css'
})
export class AdoptionListComponent implements OnInit {
  cartIds = useAdoptionCart();
  pets = signal<any[]>([]);
  selectedPets = signal<number[]>([]);
  loading = signal(true);

  constructor(private petService: PetService, private router: Router) {
    effect(() => {
      const ids = this.cartIds();

      if (ids.length === 0) {
        this.pets.set([]);
        this.selectedPets.set([]);
        this.loading.set(false); 
        return;
      }
      
      this.getPets(ids);
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}

  cleanCart() {
    clearAdoptionCart();
  }

  getPets(ids: number[]) {
    this.petService.adoptionList(ids).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.pets.set(response.data);
          this.selectedPets.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.selectedPets.set([]);
        this.pets.set([]);
        this.loading.set(false);
      }
    });
  }

  onSelectionChange(petId: number) {
    const current = this.selectedPets();
    if (current.includes(petId)) {
      this.selectedPets.set(current.filter(id => id !== petId));
    } else {
      this.selectedPets.set([...current, petId]);
    }
  }

  onPetRemoved() {
    this.getPets(this.cartIds());
  }

  goToScheduleAdoption() {
    this.router.navigate(['/adopt/schedule-adoption'], {
      queryParams: { pets: JSON.stringify(this.selectedPets()) }
    });
  }
}
