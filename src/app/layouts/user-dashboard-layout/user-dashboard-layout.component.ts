import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from "../../shared/components/side-bar/side-bar.component";

@Component({
  selector: 'app-user-dashboard-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, SideBarComponent],
  templateUrl: './user-dashboard-layout.component.html',
  styleUrl: './user-dashboard-layout.component.css'
})
export class UserDashboardLayoutComponent {
  fechaHoy: string = '';

  ngOnInit() {
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fechaCompleta = fecha.replace(/\sde\s/g, ' ');
    this.fechaHoy = this.capitalizar(fechaCompleta);
  }

  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
