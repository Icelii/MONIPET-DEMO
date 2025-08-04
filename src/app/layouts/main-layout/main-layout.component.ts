import { afterRender, Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../../shared/components/nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { take, timeout } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  user: any = {}
  
  constructor(private notificationService: NotificationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUserInfo().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result && response.data) {
          const { id } = response.data;
          this.user = { id };
          this.notificationService.subscribeToUserNotifications(this.user.id);
          //console.log('USER: ', this.user)
        }
      },
      error: (error) => {
        //console.log(error);
      }
    });
  }
}
