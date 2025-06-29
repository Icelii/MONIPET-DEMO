import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    const day = today.getDate() - birthDate.getDate();

    const isOldEnough =
      age > minAge || (age === minAge && (month > 0 || (month === 0 && day >= 0)));

    return isOldEnough ? null : { minimumAge: { requiredAge: minAge } };
  };
}