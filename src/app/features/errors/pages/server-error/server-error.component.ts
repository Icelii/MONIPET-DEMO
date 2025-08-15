import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})
export class ServerErrorComponent {
  code = 500;

  constructor(private router: Router) {
    this.code = this.router.getCurrentNavigation()?.extras.state?.['code'] ?? 500;
  }
}
