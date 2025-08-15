import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from '../../../../shared/components/button-primary/button-primary.component';
import { CommonModule } from '@angular/common';
import { EmailAlertService } from '../../../../core/services/alerts/email-alert.service';
import { Route, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { AuthService } from '../../../../core/services/auth.service';
import { take, timeout, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonPrimaryComponent, RouterModule, FormsModule, ErrorMessagesComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
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

    //console.log('FORM VALUES:', userData);

    this.authService.login(userData).pipe(timeout(15000)).subscribe({
      next: (response) => {
        const email = response.data?.email;
        const codeType = '2FA';

         this.router.navigate(['auth-code'], { state: { email, codeType } });
      },
      error: (error: HttpErrorResponse | TimeoutError) => {

        if (error instanceof TimeoutError) {
          this.onSubmit();
          return;
        }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';

        if (msg === 'La cuenta no ha sido verificada.') {
            Swal.fire({
              title: msg,
              text: "Solicita un nuevo enlace para verificar tu cuenta.",
              icon: "info",
              confirmButtonColor: "#489dba",
              confirmButtonText: "Reenviar enlace",
            }).then((result) => {
              if (result.isConfirmed) {
                this.resendVerificationEmail();
              }
            });
        } else {
          Swal.fire({
            title: "Ocurrió un error! :(",
            text: msg,
            icon: "error",
            confirmButtonColor: "#489dba",
            confirmButtonText: "Cerrar",
          })
        }
      }
    });
  }

  resendVerificationEmail() {
     const email = this.loginForm.get('email')?.value;
     console.log(email);

     this.authService.resendEmailVerification(email).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          Swal.fire({
            title: "Correo de verificación enviado",
            text: "Se ha enviado un nuevo correo de verificación, no olvides revisar la carpeta de spam.",
            icon: "success",
            confirmButtonColor: "#489dba",
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
     });
  }
}
