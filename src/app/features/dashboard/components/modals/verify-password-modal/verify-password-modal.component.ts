import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";
import { AuthService } from '../../../../../core/services/auth.service';
import { take, timeout } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-verify-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ChangePasswordModalComponent],
  templateUrl: './verify-password-modal.component.html',
  styleUrl: './verify-password-modal.component.css',
})
export class VerifyPasswordModalComponent {
  verifyPasswordForm: FormGroup;
  mostrarPassword = false;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Input() userId!: number;
  showModal = signal(false);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.verifyPasswordForm = this.fb.group({
      current_password: [''],
    });
  }

  ngOnInit() {
    
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
    
  onModalClosed() {
    this.showModal.set(false);

    const changePasswordModal = document.getElementById('changePasswordModal');
    changePasswordModal?.focus();
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  
  onSubmit() {
    if (this.verifyPasswordForm.invalid) {
      this.verifyPasswordForm.markAllAsTouched();
      return;
    }

    const userData = this.verifyPasswordForm.value;
    console.log('FORM VALUES:', userData);

    this.authService.checkPassword(userData).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.showModal.set(true);
          this.closeModal();
          this.closeModalWithBlur();
          this.verifyPasswordForm.reset();
          this.verifyPasswordForm.markAsPristine();
          this.verifyPasswordForm.markAsUntouched();
        }
      },
      error: (error) => {
        //console.log(error);
      }
    });
  }
}
