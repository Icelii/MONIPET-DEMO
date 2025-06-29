import { Component } from '@angular/core';
import { ButtonPrimaryComponent } from "../../../../shared/components/button-primary/button-primary.component";
import { ErrorMessagesComponent } from '../../../../shared/components/error-messages/error-messages.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recovery-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ErrorMessagesComponent, ButtonPrimaryComponent],
  templateUrl: './recovery-account.component.html',
  styleUrl: './recovery-account.component.css'
})
export class RecoveryAccountComponent {
  recoveryAccountForm: FormGroup;

  constructor(private fb: FormBuilder){
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

    const data = this.recoveryAccountForm.value;

    console.log('FORM VALUES:', data);
  } 
}
