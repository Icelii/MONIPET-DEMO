import { AbstractControl, ValidatorFn } from '@angular/forms';

export function hourNotInPastValidator(getDayControl: () => AbstractControl | null): ValidatorFn {
  return (control: AbstractControl): { hourInPast: boolean } | null => {
    const hourValue = control.value;
    const dayControl = getDayControl();
    const dayValue = dayControl?.value;

    if (!hourValue || !dayValue) return null;

    const today = new Date().toISOString().split('T')[0];
    if (dayValue !== today) return null;

    const [inputHour, inputMinute] = hourValue.split(':').map(Number);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (inputHour < currentHour || (inputHour === currentHour && inputMinute < currentMinute)) {
      return { hourInPast: true };
    }

    return null;
  };
}
