import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceCardComponent } from "../../components/service-card/service-card.component";
import { ServiceService } from '../../../../core/services/services/service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { take, timeout } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { addServiceToSelection, removeServiceFromSelection, selectedServices } from '../../../../core/stores/appointments.store';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ServiceCardComponent, RouterModule, NgxPaginationModule, LoaderElementsComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  p: number = 1;
  filtrosForm: FormGroup;
  dropdownOpen = false;
  services: any[] = [];
  serviciosSeleccionados= computed(() => selectedServices());
  options = [false, false, false];
  loading = signal(true);

  categorias = [
    {
      nombre: 'Categoría',
      open: false,
      opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
      seleccionadas: [false, false, false],
    },
  ];

  constructor(private authService: AuthService, private fb: FormBuilder, private serviceService: ServiceService, private router: Router) {
    this.filtrosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.getServices();
  }

  onServiceSelectionChange(event: { id: number; selected: boolean }) {
    if (event.selected) {
      addServiceToSelection(event.id);
      console.log('SELECTED: ', this.serviciosSeleccionados());
    } else {
      removeServiceFromSelection(event.id);
    }
  }

  onSubmit() {}

  getServices() {
    this.serviceService.getServices().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.services = response.data;
          this.loading.set(false);
        } else {
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  toggleDropdown(index: number) {
    this.categorias[index].open = !this.categorias[index].open;
  }

  onCheck(catIndex: number, optIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.categorias[catIndex].seleccionadas[optIndex] = input.checked;
  }

  get selectedServiceNames(): string[] {
    return this.serviciosSeleccionados()
      .map((id: any) => this.services.find(s => s.id === id))
      .filter((s: any) => s)
      .map((s: any) => s!.service);
  }

  executeIfCanSchedule(action: () => void) {
    if (this.serviciosSeleccionados().length === 0) {
      alert('Debes seleccionar al menos un servicio');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    action();
  }

  scheduleAppointment() {
    this.executeIfCanSchedule(() => {
      this.router.navigate(['/services/schedule-service'], {
        queryParams: { services: JSON.stringify(this.serviciosSeleccionados()) }
      });
    });
  }
}
