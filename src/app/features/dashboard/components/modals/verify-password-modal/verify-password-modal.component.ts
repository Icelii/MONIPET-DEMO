import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordModalComponent } from "../change-password-modal/change-password-modal.component";

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
  showModal = false;

  constructor(private fb: FormBuilder) {
    this.verifyPasswordForm = this.fb.group({
      password: [''],
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

  onModalClosed() {
    this.showModal = false;

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
  }
}
