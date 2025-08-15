import { CommonModule } from '@angular/common';
import { EventEmitter, Component, Input, Output, computed } from '@angular/core';
import { EditPetComponent } from "../modals/edit-pet/edit-pet.component";
import Swal from 'sweetalert2';
import { InfoPetComponent } from "../modals/info-pet/info-pet.component";
import { PetService } from '../../../../core/services/pets/pet.service';
import { take, timeout } from 'rxjs';
import { removeFromAdoptionCart, useAdoptionCart } from '../../../../core/stores/adoptionList.store';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, EditPetComponent, InfoPetComponent],
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.css'
})
export class PetCardComponent {
  showModal = false;
  showInfoModal = false;
  @Input() id!: number;
  @Input() photo_id!: number;
  @Input() name: string = '';
  @Input() birthday: string = '';
  @Input() spayed: boolean = false;
  @Input() breed: string = '';
  @Input() gender: string = '';
  @Input() size: string = '';
  @Input() photo_link: string = '';
  @Input() spayedLabel: string = '';
  @Input() adoptionList: boolean = false;
  @Input() appointmentAdopt: boolean = false;
  @Output() updated = new EventEmitter<void>();
  edad: string = '';
  @Output() removedFromCart = new EventEmitter<number>();
  @Input() isSelected: boolean = false;
  @Output() selectionChange = new EventEmitter<number>();

  cartIds = useAdoptionCart();
  isInCart = computed(() => this.cartIds().includes(this.id));

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    if(this.birthday) {
      this.edad = this.calculateAge(this.birthday);
    }
  }

  onPetUpdated() {
    this.updated.emit();
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
  
  deletePet(event: MouseEvent) {
    const dropdown = (event.target as HTMLElement).closest('.dropdown');
    const toggle = dropdown?.querySelector('[data-bs-toggle="dropdown"]') as HTMLElement;
    toggle?.click();
    toggle?.blur();

    Swal.fire({
      title: "¿Estás seguro de que quieres eliminar esta mascota?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#489dba",
      cancelButtonColor: "#a53f3f",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.petService.deletePet(this.id).pipe(timeout(15000), take(1)).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Macota eliminada",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              didClose: () => {
                this.updated.emit();
              }
            });
          }
        });
      }
    });
  }

  onModalClosed() {
    this.showModal = false;

    const addPetBtn = document.getElementById('addPetModalBtn');
    addPetBtn?.focus();
  }

  onInfoModalClosed() {
    this.showInfoModal = false;

    const infoBtn = document.getElementById('infoPetBtn');
    infoBtn?.focus();
  }
  
  removePet() {
    if (this.isInCart()) {
      removeFromAdoptionCart(this.id);
      this.removedFromCart.emit(this.id);
    }
  }

  toggleCheckbox() {
    this.selectionChange.emit(this.id);
  }
}
