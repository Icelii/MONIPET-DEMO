import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { AppointmentCardComponent } from "../../components/appointment-card/appointment-card.component";
import { currentUser } from '../../../../core/stores/auth.store';
import { userAppointments } from '../../../../core/stores/appointments.store';
import { AppointmentService } from '../../../../core/services/appointments/appointment.service';
import { take, timeout, TimeoutError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { ServiceService } from '../../../../core/services/services/service.service';
import { HttpErrorResponse } from '@angular/common/http';

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
 //typeService: any[] = [];
 minToDate: string | null = null;

 //PARA FILTROS
  statusFilter = signal<string>('todo');
  typeFilter = signal<string>('todo');
  fromDateFilter = signal<string | null>(null);
  toDateFilter = signal<string | null>(null);
  searchFilter = signal<string>('');

  filteredAppointments = computed(() => {
    const all = this.appointments() || [];
    const status = this.statusFilter();
    const type = this.typeFilter();
    const from = this.fromDateFilter();
    const to = this.toDateFilter();
    const search = this.searchFilter();

    return all.filter((app: any) => {
      let ok = true;

      if (status !== 'todo' && status) {
        ok = ok && app.status?.toLowerCase() === status.toLowerCase();
      }

      if (type !== 'todo' && type) {
        ok = ok && app.type_appointment?.toLowerCase() === type.toLowerCase();
      }

      if (from) {
        ok = ok && new Date(app.date) >= new Date(from);
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setDate(toDate.getDate() + 1);
        ok = ok && new Date(app.date) < toDate;
      }

      if (search) {
        ok = ok && app.id.toString().includes(search);
      }

      return ok;
    });
  });

  //PAGINACION
  p = signal(1);
  perPage = 4;  

  paginatedAppointments = computed(() => {
    const start = (this.p() - 1) * this.perPage;
    return this.filteredAppointments().slice(start, start + this.perPage);
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredAppointments().length / this.perPage)
  );

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.p.set(page);
    }
  }

 constructor(private appointmentService: AppointmentService, private serviceService: ServiceService) {
  effect(() => {
    const user = this.user();

    if(user?.id) {
      this.getAppointments();
    }
  })
 }

 ngOnInit(): void {
  //this.getTypeService();
 }

  onSelectChange(event: Event, filter: 'status' | 'type') {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    if (filter === 'status') this.statusFilter.set(select.value);
    if (filter === 'type') this.typeFilter.set(select.value);

    this.p.set(1);
  }

  onDateChange(event: Event, filter: 'from' | 'to') {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    if (filter === 'from') {
      this.fromDateFilter.set(input.value);

      const to = this.toDateFilter();
      if (to && to < input.value) {
        this.toDateFilter.set(input.value);
        (document.getElementById('toDate') as HTMLInputElement).value = input.value;
      }
    } else {
      this.toDateFilter.set(input.value);
    }

    this.p.set(1);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.searchFilter.set(input.value);

    this.p.set(1);
  }

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

/* getTypeService() {
  this.serviceService.getCategories().pipe(timeout(15000), take(1)).subscribe({
    next: (response) => {
      if (response.result) {
        this.typeService = response.data;
      }
    },
    error: (error: HttpErrorResponse | TimeoutError) => {
      console.log(error);
    }
  });
 } */

}
