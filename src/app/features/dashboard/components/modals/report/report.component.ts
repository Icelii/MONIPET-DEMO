import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  showModal = false;
  reportForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      tipo: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?¡!'"-]+$/)]],
      lugar: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(300), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?¡!'"-]+$/)]]
    });
  }

  ngOnInit() {}

  getControl(name: string): AbstractControl {
     return this.reportForm.controls[name];
  }
  
  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();

      Object.keys(this.reportForm.controls).forEach(key => {
        const control = this.reportForm.get(key);
        if (control && control.errors) {
          console.log(`Errores en ${key}:`, control.errors);
        }
      });

      return;
    }

    const data = this.reportForm.value;
    console.log('FORM VALUES:', data);
  }
  
}
