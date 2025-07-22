import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-resume.component.html',
  styleUrl: './order-resume.component.css'
})
export class OrderResumeComponent {
   @Input() subtotal: number = 0;
   @Input() discountApply: number = 0;
   @Input() total: number = 0;
   @Input() cancel: string = '';
   @Input() pay: boolean = false;
   @Input() btnLabel: string = "";
}
