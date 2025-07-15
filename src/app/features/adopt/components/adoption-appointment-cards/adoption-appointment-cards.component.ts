import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-adoption-appointment-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adoption-appointment-cards.component.html',
  styleUrl: './adoption-appointment-cards.component.css',
})
export class AdoptionAppointmentCardsComponent {
  @Input() name: string = '';
  @Input() birthday: string = '';
  @Input() spayed: boolean = false;
  @Input() breed: string = '';
  @Input() sex: string = '';
  @Input() size: string = '';
  @Input() photo_link: string = '';
  @Input() spayedLabel: string = '';
  edad: string = ''; 

  ngOnInit() {
    if(this.birthday) {
      this.edad = this.calculateAge(this.birthday);
    }
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
}
