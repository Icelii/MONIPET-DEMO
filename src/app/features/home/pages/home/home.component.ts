import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PetCardsComponent } from '../../../../shared/components/pet-cards/pet-cards.component';
import { ProductCardsComponent } from "../../../../shared/components/product-cards/product-cards.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, PetCardsComponent, ProductCardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
