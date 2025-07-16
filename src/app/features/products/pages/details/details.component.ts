import { CommonModule } from '@angular/common';
import { Component, input, Input, model } from '@angular/core';
import { CommentCardComponent } from "../../components/comment-card/comment-card.component";
import { StarRatingComponent } from "../../components/star-rating/star-rating.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, CommentCardComponent, StarRatingComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @Input() comments: number = 0;

  quantity = model(1);

  increment() {
    this.quantity.update((val) => val + 1);
  }

  decrement() {
    this.quantity.update((val) => Math.max(0, val - 1));
  }
}
