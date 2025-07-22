import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transfer-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transfer-code.component.html',
  styleUrl: './transfer-code.component.css'
})
export class TransferCodeComponent {
  @Input() transferce_code: string = '';
}
