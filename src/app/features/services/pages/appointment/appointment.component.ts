import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ServiceAppointmentCardComponent } from "../../components/service-appointment-card/service-appointment-card.component";
import { AppointmentDetailsComponent } from "../../../../shared/components/appointment-details/appointment-details.component";
import { Subscription, take, timeout } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../../../core/services/services/service.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [ServiceAppointmentCardComponent, AppointmentDetailsComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit, OnDestroy {
  services: number[] = [];
  servicesSelected = signal<any[]>([]);
  loading = signal(true);
  private queryParamsSub!: Subscription;
  selectedServiceIds: number[] = [];
  typeAppointment: string = Math.random() < 0.5 ? 'Estetica' : 'Medica';

  constructor(private router: Router, private route: ActivatedRoute, private ServiceService: ServiceService) {}

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe((params: any) => {
      this.services = params['services'] ? JSON.parse(params['services']) : [];
      //console.log('IDs servicios: ', this.services);
      this.getServicesList();
    });
  }

  getServicesList() {
    this.ServiceService.getServiceList(this.services).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.servicesSelected.set(response.data);
          this.selectedServiceIds = response.data.map((s: any) => ({
            service_id: s.id,
            price: s.price,
            discount: s.discounts ?? 0.00
          }));
          //console.log('SERVICIOS PARA LA CITA: ', response.data);
        } else {
          this.servicesSelected.set([]);
          this.selectedServiceIds = [];
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.servicesSelected.set([]);
        this.selectedServiceIds = [];
        this.loading.set(false);
        //console.log(error);
      }
    });
  }

  get total(): number {
    return this.servicesSelected().reduce((acc, service) => {
      const discount = service.discounts && service.discounts > 0 ? service.discounts : 0;
      const priceDiscounted = service.price * (1 - discount / 100);
      return acc + priceDiscounted;
    }, 0);
  }

  get totalDiscount(): number {
    return this.servicesSelected().reduce((acc, service) => {
      const discount = service.discounts && service.discounts > 0 ? service.discounts : 0;
      const discountAmount = service.price * (discount / 100);
      return acc + discountAmount;
    }, 0);
  }

  get subtotal(): number {
    return this.servicesSelected().reduce((acc, service) => acc + parseFloat(service.price), 0);
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }
}
