import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";
import { ImageFileValidator } from '../../../../../core/validators/image-file.validator';
import { PetService } from '../../../../../core/services/pets/pet.service';
import { currentUser } from '../../../../../core/stores/auth.store';
import { take, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { userPets } from '../../../../../core/stores/pets.store';

@Component({
  selector: 'app-add-pet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ErrorMessagesComponent],
  templateUrl: './add-pet.component.html',
  styleUrl: './add-pet.component.css'
})
export class AddPetComponent {
  @Input() userId!: number;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  showModal = false;
  addPetForm: FormGroup;
  updloadedImage: any;
  fechaMaxima: string = '';
  breeds = signal<any[]>([]);
  @Output() saved = new EventEmitter<void>();

  constructor(private fb:  FormBuilder, private petService: PetService) {
    this.addPetForm = this.fb.group({
      status: ['Personal'],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      breed_id: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      size: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/), Validators.min(1), Validators.max(90)]],
      height: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/), Validators.min(1), Validators.max(90)]],
      photo: [null, [Validators.required, ImageFileValidator.validImageTypes]],
      spayed: [null, Validators.required]
    })
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
    }
  }

  ngOnInit() {
    this.getBreeds();

    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  onWeightInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (value > 90) {
      input.value = '90';
      this.addPetForm.controls['weight'].setValue(90);
    }
  }
  
  onHeightInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (value > 90) {
      input.value = '90';
      this.addPetForm.controls['height'].setValue(90);
    }
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

      this.addPetForm.get('photo')?.setValue(file);
      this.addPetForm.get('photo')?.markAsTouched();
    } else {
      this.updloadedImage = null;
      this.addPetForm.get('photo')?.setValue(null);
    }
  }

  removeImage() {
    this.updloadedImage = null;
    this.addPetForm.patchValue({ photo: null });
    this.addPetForm.get('photo')?.updateValueAndValidity();
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
      return;
    }

    const data = this.addPetForm.value;
    const formData = new FormData();

    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }

    this.petService.addPet(formData).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          Swal.fire({
            title: "Mascota registrada!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then((result) => {
              this.closeModal();
              this.saved.emit();
          });
        }
      }
    });
  }

  getBreeds() {
    this.petService.getBreeds().pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.breeds.set(response.data);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
