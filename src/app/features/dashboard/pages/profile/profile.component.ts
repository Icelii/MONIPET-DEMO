import { Component } from '@angular/core';
import { ErrorMessagesComponent } from "../../../../shared/components/error-messages/error-messages.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { minimumAgeValidator } from '../../../../core/validators/minimumAge.validator';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessagesComponent, FormsModule, ReactiveFormsModule, ButtonPrimaryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  updateInfoForm: FormGroup;
  fechaMaxima: string = '';

  constructor(private fb: FormBuilder) {
    this.updateInfoForm = this.fb.group({
      name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name2: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: [''],
      birth_Date: ['', [minimumAgeValidator(18)]],
      email: ['', [Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]]
    });
  } 

  ngOnInit() {
      const hoy = new Date();
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  getControl(name: string): AbstractControl {
      return this.updateInfoForm.controls[name];
  }

  onSubmit() {
    if (this.updateInfoForm.invalid) {
      this.updateInfoForm.markAllAsTouched();
      return;
    }

    const data = this.updateInfoForm.value;

    console.log('FORM VALUES:', data);
  }
}
