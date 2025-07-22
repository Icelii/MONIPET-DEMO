import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-pet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-pet.component.html',
  styleUrl: './info-pet.component.css'
})
export class InfoPetComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  showModal = false;
  updloadedImage: any;

  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }
}
