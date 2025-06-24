import { Component, signal } from '@angular/core';
import { AuthLayoutComponent } from "../../../../layouts/auth-layout/auth-layout.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AuthLayoutComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  mostrarPassword = signal(false);
  mostrarConfirmPassword = signal(false);

  togglePassword() {
    this.mostrarPassword.update(valor => !valor);
  }

  toggleConfirmPassword() {
    this.mostrarConfirmPassword.update(valor => !valor);
  }
}
