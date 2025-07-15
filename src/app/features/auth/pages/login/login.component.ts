import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from '../../../../shared/components/button-primary/button-primary.component';
import { CommonModule } from '@angular/common';
import { EmailAlertService } from '../../../../core/services/alerts/email-alert.service';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonPrimaryComponent, RouterModule, FormsModule, ErrorMessagesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;

  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required]]
    });
  }

  getControl(name: string): AbstractControl {
    return this.loginForm.controls[name];
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  togglePasswordConfirm() {
    this.mostrarPasswordConfirm = !this.mostrarPasswordConfirm;
  }

  onSubmit(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const userData = this.loginForm.value;

    console.log('FORM VALUES:', userData);
  }
}
