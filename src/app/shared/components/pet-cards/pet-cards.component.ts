import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pet-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-cards.component.html',
  styleUrl: './pet-cards.component.css'
})
export class PetCardsComponent {
  @Input() name: string = "";
  @Input() sex: number = 3;
  @Input() age: string = "";
  @Input() photo_link: string = "";
  isAdoptRoute: boolean = false;

  constructor(private router: Router) {
    this.isAdoptRoute = this.router.url.includes('/adopt');
  }
}
