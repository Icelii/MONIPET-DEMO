import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageFileValidator } from '../../../../../core/validators/image-file.validator';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ErrorMessagesComponent],
  templateUrl: './edit-pet.component.html',
  styleUrl: './edit-pet.component.css'
})
export class EditPetComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  showModal = false;
  editPetForm: FormGroup;
  updloadedImage: any ;
  fechaMaxima: string = '';

  constructor(private fb:  FormBuilder) {
    this.editPetForm = this.fb.group({
      name: ['', [, Validators.minLength(1), Validators.maxLength(5), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      breed_id: [''],
      birthday: [''],
      gender: [''],
      size: [''],
      weight: ['', [Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/)]],
      height: ['', [Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/)]],
      image: [null, [ImageFileValidator.validImageTypes]],
      spayed: [null]
    })
  }

  ngOnInit() {
    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  getControl(name: string): AbstractControl {
      return this.editPetForm.controls[name];
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

      this.editPetForm.get('image')?.setValue(file);
      this.editPetForm.get('image')?.markAsTouched();
    } else {
      this.updloadedImage = null;
      this.editPetForm.get('image')?.setValue(null);
    }
  }

  removeImage() {
    this.updloadedImage = null;
    this.editPetForm.patchValue({ image: null });
    this.editPetForm.get('image')?.updateValueAndValidity();
  }
  
  setSpayed(value: 0 | 1) {
    const currentValue = this.editPetForm.get('spayed')?.value;
    this.editPetForm.patchValue({
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
    if (this.editPetForm.invalid) {
    this.editPetForm.markAllAsTouched();

    Object.keys(this.editPetForm.controls).forEach(key => {
      const control = this.editPetForm.get(key);
      if (control && control.errors) {
        console.log(`Errores en ${key}:`, control.errors);
      }
    });

    return;
  }

  const data = this.editPetForm.value;
  console.log('FORM VALUES:', data);
  }
}
