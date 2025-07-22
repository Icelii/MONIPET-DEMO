import { Component } from '@angular/core';
import { ErrorMessagesComponent } from "../../../../shared/components/error-messages/error-messages.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { minimumAgeValidator } from '../../../../core/validators/minimumAge.validator';
import { ConfirmAlertService } from '../../../../core/services/alerts/confirm-alert.service';
import { VerifyPasswordModalComponent } from "../../components/modals/verify-password-modal/verify-password-modal.component";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessagesComponent, FormsModule, ReactiveFormsModule, VerifyPasswordModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  updateInfoForm: FormGroup;
  fechaMaxima: string = '';
  showModal = false;

  constructor(private fb: FormBuilder, private confirmAlert: ConfirmAlertService) {
    this.updateInfoForm = this.fb.group({
      name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name2: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: [''],
      birth_Date: ['', [minimumAgeValidator(18)]],
      email: ['', [Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]]
    });
  } 

  ngOnInit() {
      const hoy = new Date();
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  onModalClosed() {
    this.showModal = false;

    const triggerBtn = document.getElementById('triggerModalBtn');
    triggerBtn?.focus();
  }

  getControl(name: string): AbstractControl {
      return this.updateInfoForm.controls[name];
  }

  confirmChanges() {
    Swal.fire({
      title: "Estas seguro de actualizar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#489dba",
      cancelButtonColor: "#a53f3f",
      confirmButtonText: "Si, actualizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    if (this.updateInfoForm.invalid) {
      this.updateInfoForm.markAllAsTouched();
      return;
    }

    const data = this.updateInfoForm.value;

    console.log('FORM VALUES:', data);
  }
}
