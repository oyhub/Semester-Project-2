import {Component, OnInit} from '@angular/core';
import {CreateNew} from "../../models/createNew.model";
import {DataService} from "../../services/data.service";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";
import {addYears, format} from 'date-fns';

@Component({
  selector: 'ws-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit {
  data: CreateNew;
  active: boolean = false;
  focused: boolean = false;
  form: FormGroup;
  validationMessage: any;
  minTime: any;
  maxTime: string;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private validationService: ValidationService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      date: ['', [Validators.required, minTime(), maxTime()]],
      photo: ['', [Validators.pattern('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')]],
      description: ['']
    });

    this.validationService.setValidationMessages({
      title: {
        required: 'Please fill in a title'
      },
      category: {
        required: 'Please select a category'
      },
      date: {
        required: 'Please select a date',
        minTime: 'End time must be in the future',
        maxTime: 'End time must be within one year from now'
      },
      photo: {
        pattern: 'Please make sure that photo is a valid URL'
      }
    });

    this.validationMessage = this.validationService.resetValidationMessages(this.form);

    this.validationService.trackFieldChanges(this.form, (fieldName, validationMessage) => {
      console.log(fieldName)
      console.log(validationMessage)
      this.validationMessage[fieldName] = validationMessage;
    });

    this.minTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");
    this.maxTime = format(addYears(new Date(), 1), "yyyy-MM-dd'T'HH:mm");

  }

  onSubmit(){
    if (this.form.status === 'INVALID'){
      this.validationMessage = this.validationService.getValidationMessages(this.form);
      return
    }

    this.data = {
      title: this.form.controls['title'].value,
      description: this.form.controls['description'].value,
      tags: [this.form.controls['category'].value, 'ws-wine'],
      endsAt: new Date(this.form.controls['date'].value).toISOString(),
      media: this.form.controls['photo'].value ? [this.form.controls['photo'].value] : null
    }

    this.dataService.postListing(this.data).subscribe({
      next: (response: any) => console.log(response),
      error: (error: any) => this.dataService.alertError(error),
      complete: () => alert("listing added")
    });
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.active = this.form.controls['category'].value ? true : false;
  }

}

//Custom validators
function minTime(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (!control.value) {
      return null;
    }
    const date = new Date(control.value);
    const now = new Date();
    if (date < now) {
      return { 'minTime': true };
    }
    return null;
  };
}

function maxTime(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (!control.value) {
      return null;
    }
    const date = new Date(control.value);
    const oneYearFromNow = addYears(new Date(), 1);
    if (date > oneYearFromNow) {
      return { 'maxTime': true };
    }
    return null;
  };
}
