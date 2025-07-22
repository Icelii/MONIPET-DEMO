import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ImageFileValidator {
  static validImageTypes(control: AbstractControl): ValidationErrors | null {
    const file = control.value;

    if (!file) return null;

    if (file instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      return allowedTypes.includes(file.type) ? null : { fileType: true };
    }

    return { invalidFile: true };
  }
}
