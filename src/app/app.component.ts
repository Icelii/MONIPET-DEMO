import { CommonModule } from '@angular/common';
import { Component, inject, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user.service';
import { take, timeout } from 'rxjs';
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

  ngOnInit() {
    this.auth.getUserInfo();
  }
}
