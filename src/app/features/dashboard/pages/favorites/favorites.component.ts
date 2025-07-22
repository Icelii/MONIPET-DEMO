import { Component } from '@angular/core';
import { ProductFavoriteCardComponent } from "../../components/product-favorite-card/product-favorite-card.component";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ProductFavoriteCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

}
