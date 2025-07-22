import { CommonModule, isPlatformBrowser} from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

declare var bootstrap: any;
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  private offcanvasInstance: any;
  private routerSub!: Subscription;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('offcanvasNavbar');
      if (element) {
        this.offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(element);
      }

      this.routerSub = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd && this.offcanvasInstance) {
          this.offcanvasInstance.hide();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
