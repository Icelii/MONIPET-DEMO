import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user.service';
import { filter, take, timeout } from 'rxjs';
import { UserBase } from './core/interfaces/user';
import { AuthService } from './core/services/auth.service';
import { LoaderComponent } from "./shared/components/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private auth = inject(AuthService);
  title = 'MoniPet';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.auth.getUserInfo();

    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          document.body.style.overflow = '';
          document.body.classList.remove('offcanvas-backdrop', 'modal-open');
          const backdrop = document.querySelector('.offcanvas-backdrop');
          if (backdrop) backdrop.remove();
        });
    }
  }
}
