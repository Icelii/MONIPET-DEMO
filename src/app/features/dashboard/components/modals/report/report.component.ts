import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";
import { ReportService } from '../../../../../core/services/reports/report.service';
import { take, timeout, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

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
  @Output() saved = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.reportForm = this.fb.group({
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?¡!'"-]+$/)]],
      place: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(300), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?¡!'"-]+$/)]]
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

    this.reportService.addReport(data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          Swal.fire({
            title: "Reporte enviado!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then((result) => {
              this.reportForm.reset();
              this.closeModal();
              this.saved.emit();
          });
        }
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        console.log(error);
      }
    });
  }
}
