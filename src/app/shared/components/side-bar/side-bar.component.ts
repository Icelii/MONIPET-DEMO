import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, NavigationStart, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

declare var bootstrap: any;
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit, OnDestroy {
  private offcanvasInstance: any;
  private routerSub?: Subscription;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    const element = document.getElementById('mobileSidebar');
    if (!element) return;

    this.offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(element);

    this.routerSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (this.offcanvasInstance && this.offcanvasInstance._element?.classList.contains('show')) {
          this.offcanvasInstance.hide();

          const onHidden = () => {
            this.cleanUpScrollLock();
            element.removeEventListener('hidden.bs.offcanvas', onHidden);
          };

          element.addEventListener('hidden.bs.offcanvas', onHidden);
        } else {
          this.cleanUpScrollLock();
        }
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  private cleanUpScrollLock() {
    if (!this.isBrowser) return;

    document.body.classList.remove('offcanvas-backdrop', 'modal-open');
    document.body.style.overflow = '';

    const backdrops = document.querySelectorAll('.offcanvas-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
  }
}
