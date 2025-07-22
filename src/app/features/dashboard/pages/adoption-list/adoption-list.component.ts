import { Component } from '@angular/core';
import { PetCardComponent } from "../../components/pet-card/pet-card.component";

@Component({
  selector: 'app-adoption-list',
  standalone: true,
  imports: [PetCardComponent],
  templateUrl: './adoption-list.component.html',
  styleUrl: './adoption-list.component.css'
})
export class AdoptionListComponent {

}
