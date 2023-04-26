import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Constants} from "../app.constants";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private validationMessages: any = {};

  constructor(private constants: Constants) { }

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
    const message = this.resetValidationMessages(formGroup);

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const errors = control.errors;
      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        message[key] = this.validationMessages[key]?.[firstErrorKey] ?? `Error key ${firstErrorKey} is missing for control ${key}`;
      }
    });

    return message;
  }

  trackFieldChanges(formGroup: FormGroup, onFieldChange: (fieldName: string, validationMessage: string) => void): void {
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key).valueChanges
        .pipe(
          debounceTime(this.constants.INPUT_DELAY),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          const validationMessage = this.getValidationMessages(formGroup)[key];
          onFieldChange(key, validationMessage);
        });
    });
  }
}
