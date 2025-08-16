import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { TransferCodeComponent } from '../../components/transfer-code/transfer-code.component';
import { OrderResumeComponent } from '../../../../shared/components/order-resume/order-resume.component';
import { CommonModule } from '@angular/common';
import { AppointmentServiceCardComponent } from "../../components/appointment-service-card/appointment-service-card.component";
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../../core/services/appointments/appointment.service';
import { appointmentDetail } from '../../../../core/stores/appointments.store';
import { take, timeout } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';

@Component({
  selector: 'app-service-appointment-detail',
  standalone: true,
  imports: [CommonModule, TransferCodeComponent, OrderResumeComponent, AppointmentServiceCardComponent, NgxPaginationModule, LoaderElementsComponent],
  templateUrl: './service-appointment-detail.component.html',
  styleUrl: './service-appointment-detail.component.css',
})
export class ServiceAppointmentDetailComponent implements OnInit {
  appointmentId!: number;
  appointment = computed(() => appointmentDetail());
  loading = signal(true);


  //PAGINACION
  p = signal(1);
  perPage = 2;

  paginatedServices = computed(() => {
    const services = this.appointment().details || [];
    const start = (this.p() - 1) * this.perPage;
    return services.slice(start, start + this.perPage);
  });

  totalPages = computed(() => {
    const services = this.appointment().details || [];
    return Math.ceil(services.length / this.perPage) || 1;
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.p.set(page);
    }
  }

  constructor(private route: ActivatedRoute, private appointmentService: AppointmentService ) {}

  ngOnInit(): void {
    this.appointmentId = +this.route.snapshot.paramMap.get('id')!;

    this.getAppointment();
  }

  getAppointment() {
    this.appointmentService.getAppointment(this.appointmentId).pipe(timeout(15000), take(1)).subscribe({
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
      }
    });
  }

  getSubtotal(details: any[]): number {
    return details.reduce((total, item) => {
      return total + Number(item.price_service || 0);
    }, 0);
  }

  getDescuentoAplicado(details: any[], total: number | string): number {
    const subtotal = details.reduce((acc, item) => acc + Number(item.price_service || 0), 0);
    const totalNum = Number(total || 0);
    return subtotal - totalNum;
  }
}
