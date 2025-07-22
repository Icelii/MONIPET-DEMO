import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ConfirmAlertService {
  constructor() {}

  showSuccessAlert(options: {
    title: string;
    msg?: string;
    confirmText?: string;
    imageUrl?: string;
    onConfirm?: () => void;
  }) {
  Swal.fire({
    html: `
      <div class="d-flex justify-content-center align-items-center mb-2">
        <div class="mb-2 icon-circle">
          <img src="/images/party-emoji.png" alt="Party emoji" style="width: 50px; height: 50px;">
        </div>
      </div>
      <h2 style="text-align: center; margin-bottom: 15px; font-weight: 600; font-size: 1.5rem;">${options.title}</h2>
      <p style="text-align: center; font-weight: 400; font-size: 1rem;">${options.msg || ''}</p>
    `,
    confirmButtonText: options.confirmText || 'Aceptar',
    confirmButtonColor: '#489dba',
    showCloseButton: true,
    background: '#fff',
    color: '#333',
    customClass: {
      popup: 'rounded-4 buttonConfirmAlert p-4',
      confirmButton: 'px-4 py-2',
    },
  }).then((result) => {
      if (result.isConfirmed && options.onConfirm) {
        options.onConfirm();
      }
    });
  }
}
