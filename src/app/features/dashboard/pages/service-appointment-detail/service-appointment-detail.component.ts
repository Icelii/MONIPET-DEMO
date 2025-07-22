import { Component, Input } from '@angular/core';
import { TransferCodeComponent } from '../../components/transfer-code/transfer-code.component';
import { OrderResumeComponent } from '../../../../shared/components/order-resume/order-resume.component';
import { CommonModule } from '@angular/common';
import { AppointmentServiceCardComponent } from "../../components/appointment-service-card/appointment-service-card.component";

@Component({
  selector: 'app-service-appointment-detail',
  standalone: true,
  imports: [CommonModule, TransferCodeComponent, OrderResumeComponent, AppointmentServiceCardComponent],
  templateUrl: './service-appointment-detail.component.html',
  styleUrl: './service-appointment-detail.component.css',
})
export class ServiceAppointmentDetailComponent {
  @Input() service: string = '';
  @Input() price: number = 0;
  @Input() discounts: number = 0;
  @Input() typeService: string = '';
  @Input() medical: boolean = false;
  @Input() adoption: boolean = false;
  @Input() status: string = '';
  @Input() desc: string = '';
}
