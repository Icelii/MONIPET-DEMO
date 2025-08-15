import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceCardComponent } from "../../components/service-card/service-card.component";
import { ServiceService } from '../../../../core/services/services/service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { take, timeout, TimeoutError } from 'rxjs';
import { LoaderElementsComponent } from '../../../../shared/components/loader-elements/loader-elements.component';
import { addServiceToSelection, removeServiceFromSelection, selectedServices } from '../../../../core/stores/appointments.store';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  //PARA FILTROS
  categoriasAgrupadas: any[] = [];
  searchText = signal('');
  filteredServices = signal<any[]>([]);
  appliedFilters: { categorias: string[] } = { categorias: [] };
  @ViewChild('resultados') resultadosRef!: ElementRef;

  constructor(private authService: AuthService, private fb: FormBuilder, private serviceService: ServiceService, private router: Router) {
    this.filtrosForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.getServices();
    this.getCategories();
  }

  onServiceSelectionChange(event: { id: number; selected: boolean }) {
    if (event.selected) {
      addServiceToSelection(event.id);
    } else {
      removeServiceFromSelection(event.id);
    }
  }

  getServices() {
    this.serviceService.getServices().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.services = response.data;
          this.filteredServices.set([...this.services]);
          console.log('SERVICIOS: ', this.filteredServices());
          this.loading.set(false);
        } else {
          this.services = [];
          this.filteredServices.set([]);
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.services = [];
        this.filteredServices.set([]);
        this.loading.set(false);
        console.log(error);
      }
    });
  }

  toggleDropdown(index: number) {
    this.categoriasAgrupadas[index].open = !this.categoriasAgrupadas[index].open;
  }

  onCheck(catIndex: number, optIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.categoriasAgrupadas[catIndex].seleccionadas[optIndex] = input.checked;
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

  getCategories() {
    this.serviceService.getCategories().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.categoriasAgrupadas = response.data.map((cat: any) => ({
            tipo: cat.type_service,
            seleccionada: false
          }));
        }
      },
      error: (error:  HttpErrorResponse | TimeoutError) => {
        console.log(error);
      }
    });
  }

  onSubmit() {
    const selectedTypes = this.categoriasAgrupadas
      .filter(cat => cat.seleccionada)
      .map(cat => cat.tipo);

    this.filteredServices.set(
      this.services.filter(service => 
        selectedTypes.length === 0 || selectedTypes.includes(service.type.type_service)
      )
    );
    this.p = 1;

  /*  setTimeout(() => {
      this.resultadosRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0); */
  }

  onSearchChange(text: string) {
    this.searchText.set(text.toLowerCase());
    this.applySearch();
  }

  applySearch() {
    const text = this.searchText();
    this.filteredServices.set(
      this.services.filter(service =>
        service.service.toLowerCase().includes(text)
      )
    );
  }

  applyFilters() {
    const { categorias } = this.appliedFilters;

    this.filteredServices.set(
      this.services.filter(service => {
        return categorias.length === 0 || categorias.includes(service.service);
      })
    );
  }
}
