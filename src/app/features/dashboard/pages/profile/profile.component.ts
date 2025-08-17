import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { ErrorMessagesComponent } from "../../../../shared/components/error-messages/error-messages.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { minimumAgeValidator } from '../../../../core/validators/minimumAge.validator';
import { ConfirmAlertService } from '../../../../core/services/alerts/confirm-alert.service';
import { VerifyPasswordModalComponent } from "../../components/modals/verify-password-modal/verify-password-modal.component";
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { take, timeout, TimeoutError } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { response } from 'express';
import { currentUser } from '../../../../core/stores/auth.store';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ErrorMessagesComponent, FormsModule, ReactiveFormsModule, VerifyPasswordModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  updateInfoForm: FormGroup;
  fechaMaxima: string = '';
  showModal = false;
  user = computed(() => currentUser());
  loadingUser = signal(true);

  genderIcons: Record<string, string> = {
    'femenino': 'https://monipetresources.sfo3.digitaloceanspaces.com/iconPhotos/femenino.png',
    'masculino': 'https://monipetresources.sfo3.digitaloceanspaces.com/iconPhotos/masculino.png',
    '39 tipos de gays': 'https://monipetresources.sfo3.digitaloceanspaces.com/iconPhotos/38-tipos-de-gays.png',
  };

  constructor(private userService: UserService, private fb: FormBuilder, private confirmAlert: ConfirmAlertService, private authService: AuthService) {
    this.updateInfoForm = this.fb.group({
      name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      last_name2: ['', [Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      gender: [''],
      birth_date: ['', [minimumAgeValidator(18)]],
      email: ['', [Validators.email, Validators.pattern('.+@[A-Za-z]+[.][A-Za-z]+(?:\.[A-Za-z]{2,})*'), Validators.maxLength(254)]]
    });

    effect(() => {
      const current = this.user();
      if (current) {
        const birthDate = current.birth_date ? new Date(current.birth_date) : null;
        const formattedDate = birthDate ? birthDate.toISOString().split('T')[0] : '';

        this.updateInfoForm.patchValue({
          name: current.name,
          last_name: current.last_name,
          last_name2: current.last_name2,
          gender: current.gender,
          birth_date: formattedDate,
          email: current.email
        });

        this.loadingUser.set(false);
      }
    },  { allowSignalWrites: true });
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
      title: "¿Estas seguro de actualizar los datos?",
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
    //console.log('FORM VALUES:', data);

   this.userService.updateUserInfo(this.user().id, data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        Swal.fire({
          title: "Datos actualizados!",
          icon: "success",
          timer: 1500,
          confirmButtonColor: "#489dba"
        }).then((result) => {
          this.authService.getUserInfo(); 
        });
      }, 
      error: (error: HttpErrorResponse | TimeoutError) => {
        
      }
    });
  }

  getGenderIcon(): string {
    const genderKey = this.user().gender?.toLowerCase() ?? 'default';
    return this.genderIcons[genderKey] ?? '/logos/logomark-grey.svg';
  }
}
