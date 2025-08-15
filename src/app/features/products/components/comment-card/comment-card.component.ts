import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
  @Input() title!: string;
  @Input() comment!: string;
  @Input() username!: string;
  @Input() date!: string;
  @Input() rate!: number; 
}
