import { Component, computed, effect, signal } from '@angular/core';
import { PetCardComponent } from "../../components/pet-card/pet-card.component";
import { CommonModule } from '@angular/common';
import { AddPetComponent } from "../../components/modals/add-pet/add-pet.component";
import { PetService } from '../../../../core/services/pets/pet.service';
import { take, timeout } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { currentUser } from '../../../../core/stores/auth.store';
import { userPets } from '../../../../core/stores/pets.store';
import { AuthService } from '../../../../core/services/auth.service';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { EditPetComponent } from "../../components/modals/edit-pet/edit-pet.component";
import { InfoPetComponent } from "../../components/modals/info-pet/info-pet.component";

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, PetCardComponent, AddPetComponent, NgxPaginationModule, LoaderElementsComponent],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent {
  user = computed(() => currentUser());
  showModal = false;
  pets = computed(() => userPets());
  loading = signal(true);
  searchText = signal('');selectedPetId?: number;
  showEditModal = false;
  showInfoModal = false;

  filteredPets = computed(() => {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const text = normalize(this.searchText().trim());
    const allPets = this.pets() as any[];

    if (!text) return allPets;

    return allPets.filter(pet => normalize(pet.name).includes(text));
  });

  // FILTROS
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

 constructor(private petService: PetService, private authService: AuthService) {
    effect(() => {
      const user = this.user();

      if (user?.id) {
        this.getPets();
      }
    });
 }

 ngOnInit() {}

  onModalClosed() {
    this.showModal = false;

    const reportModalBtn = document.getElementById('addPetModalBtn');
    reportModalBtn?.focus();
  }

  getPets() {
    this.petService.getUserPets(this.user().id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          userPets.set(response.data);
          this.loading.set(false);
        } else {
          userPets.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        userPets.set([]);
        this.loading.set(false);
        //console.log(error);
      }
    });
  }

  openEditModal(id: number) {
    this.selectedPetId = id;
    this.showEditModal = true;
  }

  openInfoModal(id: number) {
    this.selectedPetId = id;
    this.showInfoModal = true;
  }
}
