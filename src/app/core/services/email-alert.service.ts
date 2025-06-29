import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EmailAlertService {
  constructor() {}

  showSuccessAlert(options: {
    title: string;
    line1?: string;
    line2?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) {
    const htmlContent = `
      ${
        options.line1
          ? `<p style="margin: 0; color: var(--gray-color);">${options.line1}</p>`
          : ''
      }
      ${
        options.line2
          ? `<p style="margin: 0; color: var(--gray-color);">${options.line2}</p>`
          : ''
      }
    `;

    Swal.fire({
      icon: 'success',
      title: options.title,
      html: htmlContent,
      confirmButtonText: options.confirmText || 'Aceptar',
      confirmButtonColor: 'var(--primary-color)',
      showCloseButton: true,
      showCancelButton: !!options.cancelText,
      cancelButtonText: options.cancelText,
      cancelButtonColor: 'transparent',
      buttonsStyling: false,
      customClass: {
        popup: 'custom-alert',
        confirmButton: 'btn custom-confirm-btn',
        cancelButton: 'btn custom-cancel-btn',
        title: 'custom-title',
        htmlContainer: 'custom-text',
      },
    }).then((result) => {
      if (result.isConfirmed && options.onConfirm) options.onConfirm();
      if (result.dismiss === Swal.DismissReason.cancel && options.onCancel)
        options.onCancel();
    });
  }
}
