import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private validationMessages: any = {};

  constructor() { }

  setValidationMessages(messages: any) {
    this.validationMessages = messages;
  }

  resetValidationMessages(formGroup: FormGroup): any {
    const keys = Object.keys(formGroup.controls);
    const messages: any = {};
    keys.forEach(key => {
      messages[key] = '';
    });
    return messages;
  }

  getValidationMessages(formGroup: FormGroup): any {
    const messages = this.resetValidationMessages(formGroup);

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const errors = control.errors;

      if (errors) {
        messages[key] = Object.keys(errors)
          .map(errorKey => this.validationMessages[key]?.[errorKey] ?? `Error key ${errorKey} is missing for control ${key}`)
          .join(' ');
      }
    });
    return messages;
  }
}
