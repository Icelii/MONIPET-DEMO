import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../../../core/services/appointments/appointment.service';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css'
})
export class AppointmentCardComponent implements OnInit {
  @Input() id!: number;
  @Input() price: number = 0;
  @Input() discounts: number = 0;
  @Input() typeService: string = '';
  @Input() medical: boolean = false;
  @Input() adoption: boolean = false;
  @Input() status: string = '';
  @Input() desc: string = '';
  @Input() date: string | null = null;
  @Output() updated = new EventEmitter<void>();
  cancelAppointmentForm: FormGroup;

  constructor(private router: Router, private appointmentService: AppointmentService, private fb: FormBuilder) {
    this.cancelAppointmentForm = this.fb.group({
      status: ['Cancelada']
    });
  }

  ngOnInit(): void {}

  goToDetails() {
    if (this.adoption === true) {
      this.router.navigate(['dashboard/appointments/adoption', this.id]);
    } else {
      this.router.navigate(['dashboard/appointments/service', this.id]);
    }
  }

  confirmCancel() {
    Swal.fire({
      title: "¿Estas seguro de cancelar esta cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#489dba",
      cancelButtonColor: "#a53f3f",
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
         this.cancelAppointment();
      }
    });
  }

  cancelAppointment() {
    const data = this.cancelAppointmentForm.value;

    this.appointmentService.cancelAppointment(this.id, data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          if (response.result) {
            Swal.fire({
                title: "¡Cita cancelada!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then((result) => {
              this.updated.emit();
            });
          }
        }
      },
      error: (error) => {
      }
    });
  }
}
