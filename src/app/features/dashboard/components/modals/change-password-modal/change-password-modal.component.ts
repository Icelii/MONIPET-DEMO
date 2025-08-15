import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";
import Swal from 'sweetalert2';
import { UserService } from '../../../../../core/services/user.service';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent {
  changePasswordForm: FormGroup;
  mostrarPassword = false;
  mostrarPasswordConfirm = false;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Input() userId!: number;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W_]{8,}$'), Validators.maxLength(250), Validators.minLength(8)]]
    },
    { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    //console.log(this.userId);
  }

  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }

  closeModalWithBlur() {
    const modalElement = document.getElementById('verifyPassword');
    if (modalElement) {
      modalElement.blur();
    }
    this.closeModal();
  }

  getControl(name: string): AbstractControl {
      return this.changePasswordForm.controls[name];
  }
  
  private passwordsMatchValidator: Validators = (group: AbstractControl): ValidationErrors | null => {
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
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const userData = this.changePasswordForm.value;

    this.userService.updateUserInfo(this.userId, userData).pipe(timeout(15000), take(1)).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Contraseña actualizada!",
              icon: "success",
              timer: 1500,
              confirmButtonColor: "#489dba"
            }).then((result) => {
              this.closeModal();
              this.closeModalWithBlur();
              this.changePasswordForm.reset();
              this.changePasswordForm.markAsPristine();
              this.changePasswordForm.markAsUntouched();
            });
          }
    });
  }
}
