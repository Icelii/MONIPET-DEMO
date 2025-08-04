import { Injectable, NgZone } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare global {
    interface Window {
      Pusher: typeof Pusher;
      Echo: Echo<any>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private echo!: Echo<any>;
  private echoInitialized = false;

  constructor(
    private ngZone: NgZone,
    private authService: AuthService,
  ) {}

  public subscribeToUserNotifications(userId: number): void {
    const token = this.authService.getToken();

    if (!token) {
      //console.warn('Token no disponible. No se puede inicializar Echo.');
      return;
    }

    if (!this.echoInitialized) {
      this.ngZone.runOutsideAngular(() => {
        (window as any).Pusher = Pusher;

        this.echo = new Echo({
          broadcaster: 'pusher',
          key: 'e1990c2ae8142167fce6',
          cluster: 'us2',
          forceTLS: true,
          authEndpoint: `${environment.apiUrlBase}broadcasting/auth`,
          auth: {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        });

        this.echoInitialized = true;
      });
    }

    this.echo.private(`App.Models.User.${userId}`)
      .listen('.Appointment-Alert', (event: any) => {
        this.ngZone.run(() => {
          //console.log('Evento Appointment:', event);
          this.mostrarNotificacion(event.message);
        });
      });

    this.echo.private(`App.Models.User.${userId}`)
      .listen('.Order-Alert', (event: any) => {
        this.ngZone.run(() => {
          //console.log('Evento Order:', event);
          this.mostrarNotificacion(event.message);
        });
      });
  }

  private mostrarNotificacion(message: string) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 6000,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }
}
