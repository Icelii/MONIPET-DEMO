import { Component, computed, effect, Input, SimpleChanges } from '@angular/core';
import { OrderResumeComponent } from '../order-resume/order-resume.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { hourNotInPastValidator } from '../../../core/validators/hour.validators';
import { ErrorMessagesComponent } from "../error-messages/error-messages.component";
import { currentUser } from '../../../core/stores/auth.store';
import { AppointmentService } from '../../../core/services/appointments/appointment.service';
import { take, timeout } from 'rxjs';
import { ConfirmAlertService } from '../../../core/services/alerts/confirm-alert.service';
import { Router } from '@angular/router';
import { PetService } from '../../../core/services/pets/pet.service';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, OrderResumeComponent, FormsModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css',
})
export class AppointmentDetailsComponent {
  @Input() subTotal!: number;
  @Input() discount!: number;
  @Input() total!: number;
  @Input() service: boolean = true;
  @Input() submitTo!: string;
  @Input() pets!: any[];
  @Input() type!: string;
  @Input() pet_id!: number;
  user = computed(() => currentUser());
  appointmentForm: FormGroup;
  today: string = '';
  selectedDate: string = '';
  minHour: string = '';
  userPets: any[] = [];
  @Input() selectedServices: any = {};
  appointmentData: any;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private confirmAlert: ConfirmAlertService, private router: Router,
    private petService: PetService
  ) {
    this.appointmentForm = this.fb.group({
      user_id: [this.user().id],
      pet_id: [null],
      day: ['', [Validators.required]],
      hour: ['', [Validators.required, hourNotInPastValidator(() => this.appointmentForm?.get('day'))]],
      date: ['', [Validators.required]],
      status: ['Pendiente'],
      type_appointment: [this.type],
      description: ['', [Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú0-9.,¡!¿?()\"'\\s-]*$"), Validators.minLength(20), Validators.maxLength(500)]],
      total_price: [null],
    });

    effect(() => {
      const user = this.user();

      if (user?.id) {
        this.appointmentForm.patchValue({ user_id: user.id });
        this.getUserPets(user.id);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.appointmentForm) {
      this.appointmentForm.patchValue({
        type_appointment: this.type
      });
    }

    console.log('RECIVIDOS DESDE EL APPOINTMENT: ', this.selectedServices);
  }

  ngOnInit() {
    const actualDate = new Date();
    this.today = actualDate.toISOString().split('T')[0];
    this.minHour = '00:00';

    
    if(this.service) {
      this.appointmentForm.addControl('pet_id', this.fb.control('', Validators.required));
    }

    this.appointmentForm.get('day')?.valueChanges.subscribe((selectedDay) => {
      if (selectedDay === this.today) {
        const now = new Date();
        this.minHour = this.formatTime(now);
        const currentHour = this.appointmentForm.get('hour')?.value;
        if (currentHour && currentHour < this.minHour) {
          this.appointmentForm.get('hour')?.setValue(this.minHour);
        }
      } else {
        this.minHour = '00:00';
      }
    });

    this.appointmentForm.get('hour')?.valueChanges.subscribe(value => {
        if (value) {
          const [hour, minute] = value.split(':').map(Number);

          const isBefore10am = hour < 10;
          const isAfter9pm = hour > 21 || (hour === 21 && minute > 0);

          if (isBefore10am || isAfter9pm) {
            this.appointmentForm.get('hour')?.setErrors({ invalidHour: true });
          } else {
            if (this.appointmentForm.get('hour')?.hasError('invalidHour')) {
              const errors = { ...this.appointmentForm.get('hour')?.errors };
              delete errors['invalidHour'];
              if (Object.keys(errors).length === 0) {
                this.appointmentForm.get('hour')?.setErrors(null);
              } else {
                this.appointmentForm.get('hour')?.setErrors(errors);
              }
            }
          }
        }
      });
      }

  getControl(name: string): AbstractControl {
      return this.appointmentForm.controls[name];
  }
  

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  private combineDateTime() {
    const day = this.appointmentForm.get('day')?.value;
    const hour = this.appointmentForm.get('hour')?.value;
    if (day && hour) {
      const dateTimeString = `${day} ${hour}:00`;
      this.appointmentForm.get('date')?.setValue(dateTimeString);
    } else {
      this.appointmentForm.get('date')?.setValue('');
    }
  }

  getUserPets(id: any) {
    this.petService.getUserPets(id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.userPets = response.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onSubmit() {
    this.combineDateTime();

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }
        
    if (this.submitTo === 'Adoption') {
      this.appointmentForm.patchValue({
        total_price: 0.00
      });

      const { day, hour, pet_id, ...payloadAdoption } = this.appointmentForm.value;

      this.appointmentService.scheduleAdoption(payloadAdoption).pipe(timeout(15000), take(1)).subscribe({
        next: (response) => {
          if (response.result) {
            const appointmentPetsPayload = {
              appointment_id: response.data.appointment_id,
              pet_id: this.pets,
              type_appointment: 'Adoptiva'
            };

            console.log('PETS APPOINTMENT: ', appointmentPetsPayload);

            this.appointmentService.appointmentPets(appointmentPetsPayload).pipe(timeout(15000), take(1)).subscribe({
              next: (response) => {
                this.confirmAlert.showSuccessAlert({
                  title: '¡Tu cita ha sido confirmada!',
                  msg: 'Puedes ver más detalles desde tu panel.',
                  confirmText: 'Ir a mis citas',
                  onConfirm: () => {
                    this.router.navigate(['/dashboard/appointments']);
                  },
                });
              },
              error: (error) => {
                console.log(error);
              }
            })
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    
    if (this.submitTo === 'Service') {
        this.appointmentForm.patchValue({
          total_price: this.total,
        });

          const types = ['Medica', 'Estetica'];
          const randomType = types[Math.floor(Math.random() * types.length)];

        const services = this.selectedServices.map((s: any) => ({
            service_id: s.service_id,
            price: s.price,
            discount: s.discount
        }));

        const { day, hour, type_appointment, ...payloadService } = this.appointmentForm.value;

        const finalPayload = {
          ...payloadService,
          services,
          type_appointment: randomType
        };

        this.appointmentData = finalPayload;
    }
  }

  payment(finalPayload: any) {
    console.log('Ejecutando pago con payload:', finalPayload);
  }
}
