import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, FormsModule, CommonModule, ButtonPrimaryComponent, ErrorMessagesComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  newPasswordForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;

  constructor(private fb: FormBuilder) {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]]
    },
    { validators: this.passwordsMatchValidator }
    );
  }

  getControl(name: string): AbstractControl {
    return this.newPasswordForm.controls[name];
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
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    const data = this.newPasswordForm.value;

    console.log('FORM VALUES:', data);
  }
}
