import { Component, computed, effect, OnInit, signal } from '@angular/core';
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
  searchText = signal('');selectedPetId?: number;
  loading = signal(true);

  filteredPets = computed(() => {
      const text = this.searchText().toLowerCase().trim();
      const allPets = this.pets() as any [];
  
      if (!text) return allPets;
  
      return allPets?.filter(pet =>
        pet.name.toLowerCase().includes(text)
      );
  });

  // PAGINACION
  p = signal(1);
  perPage = 4;  

  paginatedPets = computed(() => {
    const start = (this.p() - 1) * this.perPage;
    return this.filteredPets().slice(start, start + this.perPage);
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredPets().length / this.perPage)
  );

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.p.set(page);
    }
  }

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

    this.p.set(1);
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
