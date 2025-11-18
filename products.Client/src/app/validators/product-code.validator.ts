import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function productCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().toUpperCase();
    const cleanValue = value.replace(/-/g, '');
    
    const codePattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const cleanPattern = /^[A-Z0-9]{16}$/;
    
    if (codePattern.test(value)) {
      return null;
    }
    
    if (cleanPattern.test(cleanValue)) {
      return null;
    }
    
    if (cleanValue.length !== 16) {
      return { invalidLength: { actualLength: cleanValue.length, requiredLength: 16 } };
    }
    
    if (!/^[A-Z0-9]+$/.test(cleanValue)) {
      return { invalidFormat: { value: cleanValue } };
    }
    
    return { invalidCode: { value: value } };
  };
}

