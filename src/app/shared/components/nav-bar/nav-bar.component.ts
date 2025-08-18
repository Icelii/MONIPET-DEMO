import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, take, timeout } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { currentUser } from '../../../core/stores/auth.store';

declare var bootstrap: any;

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  private offcanvasInstance: any;
  private routerSub!: Subscription;
  loginStatus = computed(() => !!currentUser());
  user = computed(() => currentUser());
  loading = signal(true);
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getNotifications();

    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('offcanvasNavbar');
      if (element) {
        this.offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(element);
      }

      this.routerSub = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.offcanvasInstance) {
            this.offcanvasInstance.hide();
          }
          document.body.style.overflow = '';
          document.body.classList.remove('offcanvas-backdrop', 'modal-open');
          const backdrop = document.querySelector('.offcanvas-backdrop');
          if (backdrop) backdrop.remove();
        }
      });
    }
  }

  navigateAndClose(url: string) {
    if (this.offcanvasInstance) {
      this.offcanvasInstance.hide();
    }

    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.classList.remove('offcanvas-backdrop', 'modal-open');
      const backdrop = document.querySelector('.offcanvas-backdrop');
      if (backdrop) backdrop.remove();

      this.router.navigate([url]);
    }, 200);
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
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  markAsRead(noti: any) {
    if (noti.read_at) return;
    this.userService.markAsRead(noti.id).subscribe({
      next: () => (noti.read_at = new Date().toISOString()),
      error: () => {}
    });
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(noti => !noti.read_at);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
