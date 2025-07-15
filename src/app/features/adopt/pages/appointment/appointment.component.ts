import { Component } from '@angular/core';
import { AdoptionAppointmentCardsComponent } from "../../components/adoption-appointment-cards/adoption-appointment-cards.component";
import { AppointmentDetailsComponent } from "../../../../shared/components/appointment-details/appointment-details.component";

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [AdoptionAppointmentCardsComponent, AppointmentDetailsComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {

}
