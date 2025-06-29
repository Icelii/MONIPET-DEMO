import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  standalone: true,
  imports: [],
  templateUrl: './button-primary.component.html',
  styleUrl: './button-primary.component.css'
})
export class ButtonPrimaryComponent {
  @Input() label: string = "";
  @Input() disabled: boolean = false;
}
