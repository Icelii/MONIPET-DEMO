import { Component, computed, OnInit, signal } from '@angular/core';
import { ExtraInfoComponent } from '../../components/extra-info/extra-info.component';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../../core/services/appointments/appointment.service';
import { appointmentDetail } from '../../../../core/stores/appointments.store';
import { take, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adoption-appointment-detail',
  standalone: true,
  imports: [
    CommonModule,
    ExtraInfoComponent,
    PetCardComponent,
    LoaderElementsComponent,
  ],
  templateUrl: './adoption-appointment-detail.component.html',
  styleUrl: './adoption-appointment-detail.component.css',
})
export class AdoptionAppointmentDetailComponent implements OnInit {
  appointmentId!: number;
  appointment = computed(() => appointmentDetail());
  loading = signal(true);
  cancelAppointmentForm: FormGroup;

  constructor(private route: ActivatedRoute, private appointmentService: AppointmentService, private fb: FormBuilder) {
    this.cancelAppointmentForm = this.fb.group({
      'status': ['Cancelada']
    });
  }

  ngOnInit(): void {
    this.appointmentId = +this.route.snapshot.paramMap.get('id')!;

    this.getAppointment();
  }

  getAppointment() {
    this.appointmentService
      .getAppointment(this.appointmentId)
      .pipe(timeout(15000), take(1))
      .subscribe({
        next: (response) => {
          if (response.result) {
            appointmentDetail.set(response.data);
            console.log('DATOS: ', appointmentDetail());
            this.loading.set(false);
          } else {
            appointmentDetail.set({});
            this.loading.set(false);
          }
        },
        error: (error) => {
          appointmentDetail.set({});
          this.loading.set(false);
          console.log(error);
        },
      });
  }

  confirmCancelAppointment() {
    Swal.fire({
      title: '¿Estas seguro de cancelar esta cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#489dba',
      cancelButtonColor: '#a53f3f',
      confirmButtonText: 'Si, cancelar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelAppointment();
      }
    });
  }

  cancelAppointment() {
    const data = this.cancelAppointmentForm.value;

    this.appointmentService
      .cancelAppointment(this.appointmentId, data)
      .pipe(timeout(15000), take(1))
      .subscribe({
        next: (response) => {
          if (response.result) {
            if (response.result) {
              Swal.fire({
                title: '¡Cita cancelada!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
              }).then((result) => {
                this.getAppointment();
              });
            }
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
