import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { AuthService } from '../../../../core/services/auth.service';
import { take, timeout, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, FormsModule, CommonModule, ButtonPrimaryComponent, ErrorMessagesComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;
  email: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.newPasswordForm = this.fb.group({
      email: [null],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]]
    },
    { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.email = history.state.email || null;

    if (!this.email) {
        this.router.navigate(['/login']);
        return;
    }

    this.newPasswordForm.patchValue({
      email: this.email
    });
  }

  getControl(name: string): AbstractControl {
    return this.newPasswordForm.controls[name];
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
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    const data = this.newPasswordForm.value;

    console.log('FORM VALUES:', data);

    this.authService.recoveryPass(data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: response.msg,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError){
          this.onSubmit();
          return;
        }

        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        
        Swal.fire({
          title: "Ocurrió un error! :(",
          text: msg,
          icon: "error",
          confirmButtonColor: "#489dba",
          confirmButtonText: "Cerrar",
        });
      }
    });
  }

  ngOnDestroy() {
    this.email = null;
    this.newPasswordForm.reset();
  }
}
