# Validation Service
To make validation easier, you can use the project's validation service. For example, if you set a 
validationMessage to display errors, you can easily show the correct error based on what has been 
incorrectly validated.

In the component, import ValidationService and necessary files from @Angular/forms, 
and set them up in the constructor.

```js
import {ValidationService} from "../../services/validation.service";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";

constructor(private formBuilder: FormBuilder, private validationService: ValidationService) { }
```

Create necessary variables for form and validation messages.
```js
myForm: FormGroup;
myValidationMessage: any;
```

Build the form you need in ngOnInit, with the validations that are necessary, for example:
```js
    this.myForm = this.formBuilder.group({
      myInputOne: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      myInputTwo: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]]
    });
```

Then set up your own validation messages:
```js
    this.validationService.setValidationMessages({
      myInputOne: {
        required: 'A URL is required',
        pattern: 'Please make sure the URL is a string'
      },
      myInputTwo: {
        required: 'A URL is required',
        pattern: 'Please make sure the URL is a string'
      }
    });
```

Call resetValidationMessages(myForm) to build the message structure in the service.
```js 
this.myValidationMessage = this.validationService.resetValidationMessages(this.myForm);
```

Under the relevant input fields, you can now insert a tag to display the validation message. 
The form can then look like this, for example:
```html
        <form [formGroup]="myForm" (ngSubmit)="submitForm()">
          <div>
            <label for="myInputOne">My Label</label>
            <input type="text" id="myInputOne" formControlName="myInputOne">
            <p *ngIf="myValidationMessage.myInputOne" class="error-message"> {{myValidationMessage.myInputOne}}</p>
          </div>
          <div>
            <label for="myInputTwo">My Label</label>
            <input type="text" id="myInputTwo" formControlName="myInputTwo">
            <p *ngIf="myValidationMessage.myInputTwo" class="error-message"> {{myValidationMessage.myInputTwo}}</p>
          </div>
          <button type="submit">Submit</button>
        </form>
```

Now you can use the validation service wherever it is needed. 
Below is an example of using it when changing an input field or when clicking submit:
```js
// For validating on submit
  submitForm() {
    if (this.avatarForm.status === 'INVALID'){
      this.myValidationMessage = this.validationService.getValidationMessages(this.myForm);
    }
    
//Validates when a inputfield is untuched for x seconds - time is set in app.constants.ts
  this.validationService.trackFieldChanges(this.myForm, (fieldName, validationMessage) => {
    this.myValidationMessage[fieldName] = validationMessage;
  });
```
