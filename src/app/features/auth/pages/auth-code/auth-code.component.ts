import { Component, QueryList, ElementRef, AfterViewInit, ViewChild, ViewChildren, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { ButtonPrimaryComponent } from '../../../../shared/components/button-primary/button-primary.component';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountDownComponent } from "../../components/count-down/count-down.component";
import { data2FA } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { timeout, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth-code',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ButtonPrimaryComponent, CountDownComponent],
  templateUrl: './auth-code.component.html',
  styleUrl: './auth-code.component.css',
})
export class AuthCodeComponent implements AfterViewInit, OnDestroy{
  codeFormGroup: FormGroup;
  codeError = '';
  submitting = false;
  email: string | null = null;
  showMessage: boolean = true;
  type!: string;

  @ViewChildren('codeInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild(CountDownComponent) countDown!: CountDownComponent;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.codeFormGroup = this.fb.group({
      code: this.fb.array(
        Array.from({ length: 6 }, () =>
          this.fb.control('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]$/)])
        )
      ),
    });
  }

  get codeForm(): FormArray {
    return this.codeFormGroup.get('code') as FormArray;
  }

  ngAfterViewInit() {
    this.inputs.first.nativeElement.focus();

    const { email, codeType } = history.state;

    this.email = email;
    this.type = codeType;

    if (!this.email) {
      this.router.navigate(['/login']);
      return;
    }

    if (codeType === '2FA') {
      setTimeout(() => {
        this.showMessage = true;
        this.cdr.detectChanges();
      });
    } else if (codeType === 'Recovery') {
      setTimeout(() => {
        this.showMessage = false;
        this.cdr.detectChanges();
      });
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value;

    if (/^[a-zA-Z0-9]$/.test(val)) {
      this.codeForm.at(index).setValue(val);
      if (index < 5) this.inputs.get(index + 1)?.nativeElement.focus();
      this.codeError = '';
    } else {
      this.codeForm.at(index).setValue('');
      input.value = '';
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = this.inputs.get(index)?.nativeElement;
    if (event.key === 'Backspace' && !input?.value && index > 0) {
      this.inputs.get(index - 1)?.nativeElement.focus();
    }
  }

  onSubmit() {
    if (this.submitting) return;
    this.submitting = true;

    if (this.codeForm.invalid) {
      const emptyCount = this.codeForm.controls.filter((c: AbstractControl) => c.invalid).length;
      this.codeError = `Falta${emptyCount === 1 ? '' : 'n'} ${emptyCount} caracter${emptyCount === 1 ? '' : 'es'} por ingresar.`;

      const firstInvalidIndex = this.codeForm.controls.findIndex((c: AbstractControl) => c.invalid);
      this.inputs.get(firstInvalidIndex)?.nativeElement.focus();

      this.submitting = false;
      return;
    }

    this.codeError = '';
    const fullCode = this.codeForm.value.join('');
    
    const payload: data2FA = {
      email: this.email ?? '',
      code: fullCode
    }

    this.authService.verifyCode(payload).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        this.route.queryParams.pipe(take(1)).subscribe(params => {
          if (this.type === '2FA') {
            this.authService.saveToken(response.data.token);
            this.authService.getUserInfo();
            setTimeout(() => {
              //this.router.navigate(['/']);
              window.location.href = '/';
            }, 100);
          } else if (this.type === 'Recovery') {
           this.router.navigate(['new-password'], { 
              state: { email: this.email } 
            });
          }
        });
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        if (error instanceof TimeoutError){
          this.onSubmit();
          this.codeForm.reset();
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

        this.codeForm.reset();
      },
      complete: () => {
        setTimeout(() => (this.submitting = false), 1000);
      }
    })
  }

  onTimerFinished() {
    //console.log('El contador terminó');
  }

  send2FACode() {
    this.authService.send2FACode(this.email).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          Swal.fire({
            title: "Se ha enviado un nuevo código de verificación",
            text: "No olvides revisar la carpeta de spam.",
            icon: "success",
            confirmButtonColor: "#489dba",
          }).then((result) => {
            if (result.isConfirmed) {
              this.countDown.restart();
            }
          });
          this.countDown.restart();
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        const msg = (error as HttpErrorResponse).error?.msg || 'Ha ocurrido un error inesperado';
        this.codeForm.reset();

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

  ngOnDestroy(): void {}  
}
