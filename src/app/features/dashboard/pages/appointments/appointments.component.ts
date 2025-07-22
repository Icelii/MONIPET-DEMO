import { Component } from '@angular/core';
import { AppointmentCardComponent } from "../../components/appointment-card/appointment-card.component";

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [AppointmentCardComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

}
