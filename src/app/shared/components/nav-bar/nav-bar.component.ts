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
  private isOffcanvasOpen = false;
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
    if (isPlatformBrowser(this.platformId)) {
      this.initializeOffcanvas();
      this.setupRouterSubscription();
    }
  }

  private initializeOffcanvas(): void {
    const element = document.getElementById('offcanvasNavbar');
    if (element) {
      this.offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(element);
      
      element.addEventListener('show.bs.offcanvas', () => {
        this.isOffcanvasOpen = true;
      });

      element.addEventListener('hide.bs.offcanvas', () => {
        this.isOffcanvasOpen = false;
        this.forceScrollRestore();
      });

      element.addEventListener('hidden.bs.offcanvas', () => {
        this.forceScrollRestore();
      });
    }
  }

  private setupRouterSubscription(): void {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeOffcanvasAndRestoreScroll();
      }
    });
  }

  private closeOffcanvasAndRestoreScroll(): void {
    if (this.offcanvasInstance && this.isOffcanvasOpen) {
      this.offcanvasInstance.hide();
    }
    
    setTimeout(() => {
      this.forceScrollRestore();
    }, 100);
  }

  private forceScrollRestore(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;
    
    body.classList.remove('modal-open', 'offcanvas-backdrop');
    html.classList.remove('modal-open');
    
    body.style.overflow = '';
    body.style.paddingRight = '';
    html.style.overflow = '';
    
    const backdrops = document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    if (this.isMobileDevice()) {
      body.style.touchAction = '';
      body.style.overflowY = 'auto';
      body.style.position = '';
      body.style.width = '';
      body.style.height = '';
      
      setTimeout(() => {
        window.scrollTo(0, window.scrollY);
      }, 50);
    }
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  navigateAndClose(url: string): void {
    if (this.offcanvasInstance) {
      this.offcanvasInstance.hide();
    }

    setTimeout(() => {
      this.forceScrollRestore();
      this.router.navigate([url]);
    }, 150);
  }

  getNotifications(): void {
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

  markAsRead(noti: any): void {
    if (noti.read_at) return;
    this.userService.markAsRead(noti.id).subscribe({
      next: () => (noti.read_at = new Date().toISOString()),
      error: () => {}
    });
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(noti => !noti.read_at);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    
    // Limpiar al destruir el componente
    if (isPlatformBrowser(this.platformId)) {
      this.forceScrollRestore();
    }
  }
}