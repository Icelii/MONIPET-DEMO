import { Component } from '@angular/core';
import { ExtraInfoComponent } from "../../components/extra-info/extra-info.component";
import { PetCardComponent } from "../../components/pet-card/pet-card.component";


@Component({
  selector: 'app-adoption-appointment-detail',
  standalone: true,
  imports: [ExtraInfoComponent, PetCardComponent],
  templateUrl: './adoption-appointment-detail.component.html',
  styleUrl: './adoption-appointment-detail.component.css'
})
export class AdoptionAppointmentDetailComponent {

}
