import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-extra-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extra-info.component.html',
  styleUrl: './extra-info.component.css'
})
export class ExtraInfoComponent {
  @Input() descripcion!: string;
}
