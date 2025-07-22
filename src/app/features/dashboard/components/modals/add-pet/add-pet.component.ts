import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";
import { ImageFileValidator } from '../../../../../core/validators/image-file.validator';

@Component({
  selector: 'app-add-pet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './add-pet.component.html',
  styleUrl: './add-pet.component.css'
})
export class AddPetComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  showModal = false;
  addPetForm: FormGroup;
  updloadedImage: any;
  fechaMaxima: string = '';

  constructor(private fb:  FormBuilder) {
    this.addPetForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      breed_id: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      size: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/)]],
      height: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/)]],
      image: [null, [Validators.required, ImageFileValidator.validImageTypes]],
      spayed: [null, Validators.required]
    })
  }

  ngOnInit() {
    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  getControl(name: string): AbstractControl {
      return this.addPetForm.controls[name];
  }

  fileChange(e: any) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.updloadedImage = e.target.result;
      };
      reader.readAsDataURL(file);

      this.addPetForm.get('image')?.setValue(file);
      this.addPetForm.get('image')?.markAsTouched();
    } else {
      this.updloadedImage = null;
      this.addPetForm.get('image')?.setValue(null);
    }
  }

  removeImage() {
    this.updloadedImage = null;
    this.addPetForm.patchValue({ image: null });
    this.addPetForm.get('image')?.updateValueAndValidity();
  }
  
  setSpayed(value: 0 | 1) {
    const currentValue = this.addPetForm.get('spayed')?.value;
    this.addPetForm.patchValue({
      spayed: currentValue === value ? null : value
    });
  }

  closeModal() {
    this.closed.emit();
  }

  removeFocus(event: Event) {
    (event.target as HTMLElement).blur();
    this.closeModal();
  }

  onSubmit() {
    if (this.addPetForm.invalid) {
      this.addPetForm.markAllAsTouched();

      Object.keys(this.addPetForm.controls).forEach(key => {
        const control = this.addPetForm.get(key);
        if (control && control.errors) {
          console.log(`Errores en ${key}:`, control.errors);
        }
      });

      return;
    }

    const data = this.addPetForm.value;
    console.log('FORM VALUES:', data);
  }
}
