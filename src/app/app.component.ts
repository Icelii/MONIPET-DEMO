import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user.service';
import { take, timeout } from 'rxjs';
import { UserBase } from './core/interfaces/user';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user: UserBase | null = null;
  title = 'MoniPet';

  constructor(private ngZone: NgZone, private userService: UserService, private authService: AuthService) {
    //this.ngZone.onUnstable.subscribe(() => console.warn('⚠️ Angular inestable'));
    //this.ngZone.onStable.subscribe(() => console.info('✅ Angular estable'));
  }

  ngOnInit() {
    
  }
}
