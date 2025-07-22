import { Component } from '@angular/core';
import { PetCardComponent } from "../../components/pet-card/pet-card.component";
import { CommonModule } from '@angular/common';
import { AddPetComponent } from "../../components/modals/add-pet/add-pet.component";

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, PetCardComponent, AddPetComponent],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent {
 showModal = false;

 constructor() {}

 ngOnInit() {}

  onModalClosed() {
    this.showModal = false;

    const reportModalBtn = document.getElementById('addPetModalBtn');
    reportModalBtn?.focus();
  }
}
