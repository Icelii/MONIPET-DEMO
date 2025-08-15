import { CommonModule } from '@angular/common';
import { afterRender, Component, computed, effect, Input, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from "../../shared/components/side-bar/side-bar.component";
import { AuthService } from '../../core/services/auth.service';
import { take, timeout } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { UserService } from '../../core/services/user.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { currentUser } from '../../core/stores/auth.store';

@Component({
  selector: 'app-user-dashboard-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SideBarComponent, NgxSkeletonLoaderModule],
  templateUrl: './user-dashboard-layout.component.html',
  styleUrl: './user-dashboard-layout.component.css'
})
export class UserDashboardLayoutComponent implements OnInit{
  fechaHoy: string = '';
  user = computed(() => currentUser());
  notifications: any[] = [];
  loadingUser = signal(true);
  loadingNotis = signal(true);

  genderIcons: Record<string, string> = {
    'femenino': 'https://monipetresources.sfo3.digitaloceanspaces.com/iconPhotos/femenino.png',
    'masculino': 'https://monipetresources.sfo3.digitaloceanspaces.com/iconPhotos/masculino.png',
    '39 tipos de gays': 'https://monipetresources.sfo3.digitaloceanspaces.com/iconPhotos/38-tipos-de-gays.png',
  };

  constructor(private authService: AuthService, private notificationService: NotificationService, private userService: UserService) {
    effect(() => {
      const user = this.user();

      if (user?.id) {
        this.notificationService.subscribeToUserNotifications(user.id);
      }
    })
  }

  ngOnInit() {
    this.getNotifications();

    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fechaCompleta = fecha.replace(/\sde\s/g, ' ');
    this.fechaHoy = this.capitalizar(fechaCompleta);
  }

  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  getNotifications() {
    this.userService.getNotifications().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response && response.data) {
          const rawNotifications = Array.isArray(response.data) ? response.data : response.data.data;
          this.notifications = rawNotifications.map((noti: any) => ({
            id: noti.id,
            message: noti.data.message,
            read_at: noti.read_at
          }));
          this.loadingNotis.set(false);
          //console.log('NOTIS:', this.notifications);
        } else {
          //console.log('Respuesta recibida sin estructura esperada:', response);
        }
      },
      error: (error) => {
        this.loadingNotis.set(false);
        //console.error(error);
      }
    });
  }

  getGenderIcon(): string {
    const genderKey = this.user().gender?.toLowerCase() ?? 'default';
    return this.genderIcons[genderKey] ?? '/logos/logomark-grey.svg';
  }

  markAsRead(noti: any) {
    if (noti.read_at) return;

    this.userService.markAsRead(noti.id).subscribe({
      next: () => {
        noti.read_at = new Date().toISOString();
      },
      error: (error) => {
        console.error('Error marcando notificación como leída', error);
      }
    })
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(noti => !noti.read_at);
  }
}
