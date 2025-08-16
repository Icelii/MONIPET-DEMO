import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AdoptionAppointmentCardsComponent } from "../../components/adoption-appointment-cards/adoption-appointment-cards.component";
import { AppointmentDetailsComponent } from "../../../../shared/components/appointment-details/appointment-details.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../../../core/services/pets/pet.service';
import { Subscription, take, timeout } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, AdoptionAppointmentCardsComponent, AppointmentDetailsComponent, LoaderElementsComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit, OnDestroy {
  pet_id: number[] = [];
  petsAdoption = signal<any[]>([]);
  loading = signal(true);
  private queryParamsSub!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private petService: PetService) {
    this.route.queryParams.subscribe((params: any) => {
      this.pet_id = params['pets'] ? JSON.parse(params['pets']) : [];
      //console.log('IDs de mascotas:', this.pet_id);
    });
  }

  ngOnInit(): void {
    this.getPets();
  }
  
  getPets() {
    this.petService.adoptionList(this.pet_id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
           this.petsAdoption.set(response.data);
           this.loading.set(false);
        } else {
          this.petsAdoption.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.petsAdoption.set([]);
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }
}
