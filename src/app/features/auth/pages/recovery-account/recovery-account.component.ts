import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { take, timeout, TimeoutError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-recovery-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ErrorMessagesComponent, ButtonPrimaryComponent],
  templateUrl: './recovery-account.component.html',
  styleUrl: './recovery-account.component.css'
})
export class RecoveryAccountComponent {
  recoveryAccountForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private router: Router){
    this.recoveryAccountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]],
    })
  }

  getControl(name: string): AbstractControl {
    return this.recoveryAccountForm.controls[name];
  }

  onSubmit(){
    if (this.recoveryAccountForm.invalid) {
      this.recoveryAccountForm.markAllAsTouched();
      return;
    }

    const email = this.recoveryAccountForm.get('email')?.value;

        this.authService.send2FACode(email).pipe(timeout(15000), take(1)).subscribe({
          next: (response) => {
            if (response.result) {
              const codeType = 'Recovery';

              this.router.navigate(['auth-code'], { state: { email, codeType } });
            }
          },
          error: (error: HttpErrorResponse | TimeoutError) => {
            //console.log(error);
    
            if (error instanceof TimeoutError) {
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
}
