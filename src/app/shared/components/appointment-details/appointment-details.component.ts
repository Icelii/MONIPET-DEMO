import { Component, Input } from '@angular/core';
import { OrderResumeComponent } from '../order-resume/order-resume.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { hourNotInPastValidator } from '../../../core/validators/hour.validators';
import { ErrorMessagesComponent } from "../error-messages/error-messages.component";

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, OrderResumeComponent, FormsModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.css',
})
export class AppointmentDetailsComponent {
  @Input() subTotal: number = 0;
  @Input() discount: number = 0;
  @Input() total: number = 0;
  @Input() service: boolean = true;
  @Input() submitToUrl: string | null = null;
  appointmentForm: FormGroup;
  today: string = '';
  selectedDate: string = '';
  minHour: string = '';

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      day: ['', [Validators.required]],
      hour: ['', [Validators.required, hourNotInPastValidator(() => this.appointmentForm?.get('day'))]],
      date: ['', [Validators.required]],
      description: ['', [Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú0-9.,¡!¿?()\"'\\s-]*$"), Validators.minLength(20), Validators.maxLength(500)]],
    });
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
      const dateTimeString = `${day}T${hour}:00`;
      this.appointmentForm.get('date')?.setValue(dateTimeString);
    } else {
      this.appointmentForm.get('date')?.setValue('');
    }
  }

  onSubmit() {
    this.combineDateTime();

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const data = this.appointmentForm.value;

    console.log('FORM VALUES:', data);
    console.log('SUBMIT URL: ', this.submitToUrl);
  }
}
