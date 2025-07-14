import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { minimumAgeValidator } from '../../../../core/validators/minimumAge.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ErrorMessagesComponent, ButtonPrimaryComponent, CommonModule, LoaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showLoader = false;
  
  registerForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;
  fechaMaxima: string = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name2: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: ['', [Validators.required]],
      birth_Date: ['', [Validators.required, minimumAgeValidator(18)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]]
    },
    { validators: this.passwordsMatchValidator }
  );
  }

  ngOnInit() {
      const hoy = new Date();
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  getControl(name: string): AbstractControl {
    return this.registerForm.controls[name];
  }

  private passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { noMatch: true };
  };

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  togglePasswordConfirm() {
    this.mostrarPasswordConfirm = !this.mostrarPasswordConfirm;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data = this.registerForm.value;

    console.log('FORM VALUES:', data);
  }
}
