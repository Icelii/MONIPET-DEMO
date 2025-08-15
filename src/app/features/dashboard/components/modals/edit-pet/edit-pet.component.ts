import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageFileValidator } from '../../../../../core/validators/image-file.validator';
import { ErrorMessagesComponent } from "../../../../../shared/components/error-messages/error-messages.component";
import { PetService } from '../../../../../core/services/pets/pet.service';
import { take, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { pet } from '../../../../../core/stores/pets.store';

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ErrorMessagesComponent],
  templateUrl: './edit-pet.component.html',
  styleUrl: './edit-pet.component.css'
})
export class EditPetComponent {
  @Input() id!: number;
  @Input() photo_id!: number;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  showModal = false;
  editPetForm: FormGroup;
  updloadedImage: any ;
  fechaMaxima: string = '';
  breeds: any[] = [];
  //pet = computed(() => pet());
  pet: any = {};

  constructor(private fb:  FormBuilder, private petService: PetService) {
    this.editPetForm = this.fb.group({
      name: ['', [Validators.minLength(1), Validators.maxLength(55), Validators.pattern("^[A-Za-zÑñÁÉÍÓÚáéíóú\\s']{1,55}$")]],
      breed_id: [''],
      birthday: [''],
      gender: [''],
      size: [''],
      weight: ['', [Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/), Validators.min(1), Validators.max(90)]],
      height: ['', [Validators.pattern(/^[0-9]{1,3}(\.[0-9]{1,2})?$/), Validators.min(1), Validators.max(90)]],
      photo: [null, [ImageFileValidator.validImageTypes]],
      spayed: [null]
    })
  }

  ngOnInit() {
    this.getBreeds();
    this.getPet();
    
    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    this.fechaMaxima = fecha.toISOString().split('T')[0];
  }

  onWeightInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (value > 90) {
      input.value = '90';
      this.editPetForm.controls['weight'].setValue(90);
    }
  }
  
  onHeightInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (value > 90) {
      input.value = '90';
      this.editPetForm.controls['height'].setValue(90);
    }
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

      this.editPetForm.get('photo')?.setValue(file);
      this.editPetForm.get('photo')?.markAsTouched();
    } else {
      this.updloadedImage = null;
      this.editPetForm.get('photo')?.setValue(null);
    }
  }

  removeImage() {
    this.updloadedImage = null;
    this.editPetForm.patchValue({ photo: null });
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
      return;
    }

    const data = { ...this.editPetForm.value };
    const photoFile = this.editPetForm.get('photo')?.value;
    delete data.photo;

    //ENVIAR DATOS
    this.petService.editPet(this.id, data).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          if (photoFile) {
            this.uploadImage(photoFile);
          } else {
            Swal.fire({
              title: "Datos actualizados!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              didClose: () => {
                this.closeModal();
                this.updated.emit();
              }
            });
          }
        } else {
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    this.petService.updatePetPhoto(this.id, formData).pipe(take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          Swal.fire({
            title: "Datos actualizados!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            didClose: () => {
              this.closeModal();
              this.updated.emit();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al subir imagen: ', error);
      }
    });
  }

  getBreeds() {
    this.petService.getBreeds().pipe(timeout(1500), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.breeds = response.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getPet() {
    this.petService.getPet(this.id).pipe(timeout(15000), take(1)).subscribe({
      next: (response) => {
        if (response.result) {
          this.pet = response.data

          const birthDate = new Date(response.data.birthday);

          if (!isNaN(birthDate.getTime())) {
            const formattedDate = birthDate.toISOString().split('T')[0];

            this.editPetForm.patchValue({
              name: response.data.name,
              breed_id: response.data.breed.id,
              birthday: formattedDate,
              spayed: response.data.spayed,
              gender: response.data.gender,
              size: response.data.size,
              height: response.data.height,
              weight: response.data.weight
            });
            this.updloadedImage = response.data.pet_photos?.[0]?.photo_link ?? null;
          } else {
            this.editPetForm.patchValue({
                name: response.data.name,
                breed_id: response.data.breed?.id ?? '',
                birthday: '',
                spayed: response.data.spayed,
                gender: response.data.gender,
                size: response.data.size,
                height: response.data.height,
                weight: response.data.weight
            });
            this.updloadedImage = response.data.pet_photos?.[0]?.photo_link ?? null;
          }
        } else {
            this.editPetForm.patchValue({
              name: response.data.name,
              breed_id: response.data.breed?.id ?? '',
              birthday: '',
              spayed: response.data.spayed,
              gender: response.data.gender,
              size: response.data.size,
              height: response.data.height,
              weight: response.data.weight
          });
          this.updloadedImage = response.data.pet_photos?.[0]?.photo_link ?? null;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
