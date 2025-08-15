import { afterRender, Component, computed, effect, OnInit } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { take, timeout } from 'rxjs';
import { currentUser } from '../../core/stores/auth.store';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  user = computed(() => currentUser());
  
  constructor(private notificationService: NotificationService, private authService: AuthService) {
    effect(() => {
      const user = this.user();

      if (user?.id) {
        this.notificationService.subscribeToUserNotifications(user.id);
      }
    })
  }

  ngOnInit(): void {}
}
