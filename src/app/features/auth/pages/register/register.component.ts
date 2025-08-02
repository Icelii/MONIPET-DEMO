import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { minimumAgeValidator } from '../../../../core/validators/minimumAge.validator';
import { RegisterData } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { EmailAlertService } from '../../../../core/services/alerts/email-alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ErrorMessagesComponent, ButtonPrimaryComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;
  fechaMaxima: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private emailAlert: EmailAlertService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.required, Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name2: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: ['', [Validators.required]],
      birth_date: ['', [Validators.required, minimumAgeValidator(18)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]]
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
    const confirm = group.get('password_confirmation')?.value;
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

    const data: RegisterData = this.registerForm.value;

    this.authService.register(data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        this.emailAlert.showSuccessAlert({
            title: '¡Revisa tu correo!',
            line1: 'Te enviamos un enlace para verificar tu cuenta.',
            line2: 'No olvides revisar la carpeta de spam.',
            confirmText: 'Reenviar correo',
            cancelText: 'Ir al inicio de sesión <img src="/icons/arrow-narrow-right.svg" alt="">',
            onConfirm: () => {
              // Acción para reenviar correo
            },
            onCancel: () => {
              this.router.navigate(['/login']);
            },
          });
      },
      error: (error) => {
        console.log(error);
        if(error.name === "TimeOutError"){
            this.onSubmit();
            return;
        }
        Swal.fire({
          title: 'Error',
          text: 'Ocurrio un error :(',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
