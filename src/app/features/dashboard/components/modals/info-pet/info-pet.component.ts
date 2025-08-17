import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PetService } from '../../../../../core/services/pets/pet.service';
import { take, timeout } from 'rxjs';
import { pet } from '../../../../../core/stores/pets.store';

@Component({
  selector: 'app-info-pet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-pet.component.html',
  styleUrl: './info-pet.component.css'
})
export class InfoPetComponent implements OnInit{
  @Input() id!: number;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  pet: any = {};
  showModal = false;
  updloadedImage: any;

  constructor(private petService: PetService) {}

  ngOnInit() {
    //this.getPet();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && this.id) {
      this.getPet();
    }
  }

  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }

  getPet() {
    this.petService.getPet(this.id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.pet = response.data;
        }
      },
      error: (error) => {
        //console.log(error);
      }
    });
  }
}
