import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { AppointmentCardComponent } from "../../components/appointment-card/appointment-card.component";
import { currentUser } from '../../../../core/stores/auth.store';
import { userAppointments } from '../../../../core/stores/appointments.store';
import { AppointmentService } from '../../../../core/services/appointments/appointment.service';
import { take, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, AppointmentCardComponent, NgxPaginationModule, LoaderElementsComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
 user = computed(() => currentUser());
 appointments = computed(() => userAppointments());
 loading = signal(true);
 p: number = 1; 

 constructor(private appointmentService: AppointmentService) {
  effect(() => {
    const user = this.user();

    if(user?.id) {
      this.getAppointments();
    }
  })
 }

 ngOnInit(): void {}

 getAppointments() {
  this.appointmentService.getAppointments(this.user().id).pipe(timeout(15000), take(1)).subscribe({
    next: (response) => {
      if (response.result) {
        userAppointments.set(response.data);
        this.loading.set(false);
        console.log('CITAS: ', userAppointments());
      } else {
        userAppointments.set([]);
        this.loading.set(false);
      }
    },
    error: (error) => {
      userAppointments.set([]);
      this.loading.set(false);
      console.log(error);
    }
  });
 }
}
