import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  code!: number;
  message: string = '';

  private messages400: Record<number, string> = {
    400: 'Solicitud incorrecta. Por favor revisa los datos enviados.',
    404: 'La página que buscas no existe.',
    401: 'No autorizado. Debes iniciar sesión.',
    403: 'Acceso denegado. No tienes permisos para realizar esta acción.',
    422: 'Los datos enviados no cumplen con los requisitos.',
  };

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.code = this.route.snapshot.data['code'] ?? 400;
    this.message = this.messages400[this.code] || 'Ocurrió un error en la solicitud.';
  }
}
