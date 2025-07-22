import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css'
})
export class AppointmentCardComponent {
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() discounts: number = 0;
  @Input() typeService: string = '';
  @Input() medical: boolean = false;
  @Input() adoption: boolean = false;
  @Input() status: string = '';
  @Input() desc: string = '';
}
