import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-report.component.html',
  styleUrl: './info-report.component.css'
})
export class InfoReportComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  showModal = false;

  constructor() {}

  ngOnInit() {}

  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }

}
