import {  AbstractControl } from "@angular/forms";

export function dateNotPastValidator(control: AbstractControl): {[key: string]: any} | null {
  const currentDate = new Date();
  const selectedDate = new Date(control.value);
  
  if (selectedDate < currentDate) {
    return {'dateNotPast': true};
  }
  
  return null;
}