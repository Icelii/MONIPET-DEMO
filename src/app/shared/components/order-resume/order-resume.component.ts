import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { OrdenService } from '../../../core/services/orders/orden.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { take, timeout } from 'rxjs';
import { AppointmentService } from '../../../core/services/appointments/appointment.service';
import { StripeService } from '../../../core/services/stripe.service';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { SuccessAlertService } from '../../../core/services/alerts/success-alert.service';
import { ConfirmAlertService } from '../../../core/services/alerts/confirm-alert.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-order-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-resume.component.html',
  styleUrl: './order-resume.component.css'
})
export class OrderResumeComponent implements OnInit {
  @Input() id!: number;
  @Input() appointmentId!: number;
  @Input() subtotal: number = 0;
  @Input() discountApply: number = 0;
  @Input() total: number = 0;
  @Input() cancel: string = '';
  @Input() pay: boolean = false;
  @Input() btnLabel: string = "";
  @Output() updated = new EventEmitter<void>();
  @Input() cartProducts: any[] = [];
  @Input() appointmentData!: any;
  @Input() typePayment!: string;
  cancelOrderForm: FormGroup;
  cancelAppointmentForm: FormGroup;
  @Output() submitForm = new EventEmitter<void>();

  stripe!: Stripe | null;
  elements!: StripeElements;
  card!: StripeCardElement;
  clientSecret!: string;

  cardElement: any;
  cardErrors: string = '';
  
  constructor(private ordenService: OrdenService, private appointmentService: AppointmentService, 
    private fb: FormBuilder, private stripeService: StripeService,
    private confirmAlert: ConfirmAlertService, private router: Router,
    public  loaderService: LoaderService
  ) {
    this.cancelOrderForm = this.fb.group({
      'status': ['Cancelada']
    });

    this.cancelAppointmentForm = this.fb.group({
      'status': ['Cancelada']
    });
  }

  onButtonClick() {
    this.submitForm.emit();
  }

  async ngOnInit() {
    this.stripe = await this.stripeService.getStripe();
    if (!this.stripe) {
      console.error('Stripe no cargó');
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', {hidePostalCode: true} );
    this.card.mount('#card-element');
  }

  ngOnChanges() {
    //console.log('Productos recibidos del carrito:', this.cartProducts);
    //console.log('PAYLOAD: ', this.appointmentData);
  }

  confirmCancelOrder() {
    Swal.fire({
      title: "¿Estas seguro de cancelar esta orden?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#489dba",
      cancelButtonColor: "#a53f3f",
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
         this.cancelOrder();
      }
    });
  }

  cancelOrder() {
    const data = this.cancelOrderForm.value;
   
    this.ordenService.cancelOrder(this.id, data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          if (response.result) {
            Swal.fire({
              title: "¡Orden cancelada!",
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
          console.log(error);
        }
    });
  }

  confirmCancelAppointment() {
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
   
    this.appointmentService.cancelAppointment(this.appointmentId, data).pipe(timeout(15000), take(1)).subscribe({
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
          console.log(error);
        }
    });
  }

  async payment() {
    if (this.typePayment === 'cart') {
      const total = this.total;

      if (total < 5) {
        Swal.fire({
          title: 'Error',
          text: 'El monto mínimo para pagar es $5 MXN',
          icon: 'error',
        });
        return;
      }

      //const amountInCents = Math.round(total * 100);

      this.stripeService.createPaymentIntent(total, { type: 'order'})
        .subscribe(async res => {
          this.clientSecret = res.clientSecret;

          const result = await this.stripe?.confirmCardPayment(this.clientSecret, {
            payment_method: { card: this.card }
          });

          if (result?.error) {
            Swal.fire({
              title: "Ocurrió un error! :(",
              text: result.error.message,
              icon: "error",
              confirmButtonColor: "#489dba",
              confirmButtonText: "Cerrar",
            });
            return;
          }

          if (result?.paymentIntent?.status === 'succeeded') {
            console.log('CARRITO INFO: ', this.cartProducts);
            this.stripeService.confirmPayment(result.paymentIntent.id, { products: this.cartProducts })
              .subscribe({
                next: (resp) => {
                  this.confirmAlert.showSuccessAlert({
                    title: '¡Tu orden ha sido confirmada!',
                    msg: 'Gracias por tu compra. Pronto estará lista para ser recogida. Puedes ver más detalles desde tu panel.',
                    confirmText: 'Ir a mis ordenes',
                    onConfirm: () => { 
                      this.router.navigate(['/dashboard/orders']);
                    },
                  });
                },
                error: (err) => {
                  Swal.fire({
                    title: "Ocurrió un error! :(",
                    text: err.error?.error || err.message,
                    icon: "error",
                    confirmButtonColor: "#489dba",
                    confirmButtonText: "Cerrar",
                  });
                }
              });
          }
        });
    }
    
    if (this.typePayment === 'services' && this.appointmentData) {

      const total = parseFloat(this.appointmentData.total_price);
      if (total < 5) {
        Swal.fire({
          title: 'Error',
          text: 'El monto mínimo para pagar es $5 MXN',
          icon: 'error'
        });
        return;
      }

      //const amountInCents = Math.round(total * 100);

      const metadata = {
        ...this.appointmentData,
        services: JSON.stringify(this.appointmentData.services),
        pet_id: this.appointmentData.pet_id.toString(),
        total_price: total.toString()
      };

      console.log('METADATA: ', metadata);

      this.stripeService.createPaymentIntent(total, { type: 'appointment'})
        .subscribe(async res => {
          this.clientSecret = res.clientSecret;

          const result = await this.stripe?.confirmCardPayment(this.clientSecret, {
            payment_method: { card: this.card }
          });

          if (result?.error) {
            Swal.fire({
              title: "Ocurrió un error! :(",
              text: result.error.message,
              icon: "error",
              confirmButtonColor: "#489dba",
              confirmButtonText: "Cerrar",
            });
            return;
          }

          if (result?.paymentIntent?.status === 'succeeded') {
            this.stripeService.confirmPayment(result.paymentIntent.id, metadata)
              .subscribe({
                next: (resp) => {
                  this.confirmAlert.showSuccessAlert({
                    title: '¡Tu cita está confirmada!',
                    msg: 'Estamos listos para recibirte. Puedes ver más detalles desde tu panel.',
                    confirmText: 'Ir a mis citas',
                    onConfirm: () => { 
                      this.router.navigate(['/dashboard/appointments']);
                    },
                  });
                },
                error: (err) => {
                  Swal.fire({
                    title: "Ocurrió un error! :(",
                    text: err.error?.error || err.message,
                    icon: "error",
                    confirmButtonColor: "#489dba",
                    confirmButtonText: "Cerrar",
                  });
                }
              });
          }
        });
    }
  }
}
