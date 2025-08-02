import { Component, QueryList, ElementRef, AfterViewInit, ViewChild, ViewChildren, ChangeDetectorRef} from '@angular/core';
import { ButtonPrimaryComponent } from '../../../../shared/components/button-primary/button-primary.component';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CountDownComponent } from "../../components/count-down/count-down.component";
import { data2FA } from '../../../../core/interfaces/user';
import { AuthService } from '../../../../core/services/auth.service';
import { timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-code',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ButtonPrimaryComponent, CountDownComponent],
  templateUrl: './auth-code.component.html',
  styleUrl: './auth-code.component.css',
})
export class AuthCodeComponent implements AfterViewInit{
  codeFormGroup: FormGroup;
  codeError = '';
  submitting = false;
  email: string | null = null;
  showMessage: boolean = true;

  @ViewChildren('codeInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

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

    this.route.queryParams.pipe(take(1)).subscribe(params => {
      this.email = params['email'] || null;

      if (params['codeType'] === '2FA') {
        setTimeout(() => {
          this.showMessage = false;
          this.cdr.detectChanges();
        });
      }
    });
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
        this.authService.saveToken(response.data.token);
        this.router.navigate(['/']);
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
      },
      complete: () => {
        setTimeout(() => (this.submitting = false), 1000);
      }
    })
  }

  onTimerFinished() {
    console.log('El contador terminó');
  }
}
