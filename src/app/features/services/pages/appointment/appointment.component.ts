import { Component } from '@angular/core';
import { ServiceAppointmentCardComponent } from "../../components/service-appointment-card/service-appointment-card.component";
import { AppointmentDetailsComponent } from "../../../../shared/components/appointment-details/appointment-details.component";

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [ServiceAppointmentCardComponent, AppointmentDetailsComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {

}
