import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
  modalAbierto = false;

  constructor(private fb: FormBuilder) {
    this.verifyPasswordForm = this.fb.group({
      password: [''],
    });
  }

  ngOnInit() {}

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
