import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function minDateValidator(minDate: Date, type: string = 'date'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!minDate)
      return null
    // parse control value to Date
    const date = new Date(control.value);
    // check if control value is superior to date given in parameter
    if (new Date(minDate).getTime() <= date.getTime()) {
      return null;
    } else {
      return {
        'min': {
          value: control.value, min: minDate
        //  ['code_1307','date'].includes(type) ? minDate : `${minDate.getHours()}:${minDate.getMinutes()}:${minDate.getSeconds()}`
        }
      };

    }
  };
}
export function maxDateValidator(maxDate: Date, type: string = 'date'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!maxDate) return null
    // parse control value to Date
    const date = new Date(control.value);
    // check if control value is superior to date given in parameter
    if (new Date(maxDate).getTime() >= date.getTime()) {
      return null;
    } else {
      return {
        'max': {
          value: control.value, max:maxDate
         // ['code_1307','date'].includes(type)? maxDate : `${maxDate.getHours()}:${maxDate.getMinutes()}:${maxDate.getSeconds()}`
        }
      };

    }
  };
}
