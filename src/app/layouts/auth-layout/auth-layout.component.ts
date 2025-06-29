import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  imageUrl = '';

    constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('register')) {
        this.imageUrl = '/images/img1.webp';
      } else {
        this.imageUrl = '/images/img2.webp';
      }
    });
  }
}
