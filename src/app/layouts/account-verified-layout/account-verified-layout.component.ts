import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-account-verified-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './account-verified-layout.component.html',
  styleUrl: './account-verified-layout.component.css'
})
export class AccountVerifiedLayoutComponent {
  imageUrl = '';
  title = '';
  subtitle = '';
  subtitle2 = '';

    constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('verification-success')) {
        this.imageUrl = '/icons/mail-check.svg';
        this.title = '¡Cuenta verificada con éxito! 🎉';
        this.subtitle = 'Has verificado tu cuenta correctamente. Te damos la bienvenida 🐾';
      } else if (url.includes('verification-fail')){
        this.imageUrl = '/icons/mail-cancel.svg';
        this.title = 'Enlace de verificación no válido';
        this.subtitle = 'Puede que el enlace haya caducado o ya haya sido usado.';
        this.subtitle2 = 'Solicita un nuevo correo de verificación.';
      }
    });
  }
}
