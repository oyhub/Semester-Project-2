import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {InputComponent} from "../../components/inputs/input.component"
import { CreateNew} from "../../models/createNew.model";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'ws-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit {
  data: CreateNew;
  active: boolean = false;
  focused: boolean = false;

  @ViewChild('titleInput', { static: false }) title: InputComponent;
  @ViewChild('categoryInput', { static: false }) category: ElementRef;
  @ViewChild('dateInput', { static: false }) date: ElementRef;
  @ViewChild('hourInput', { static: false }) hour: ElementRef;
  @ViewChild('minInput', { static: false }) min: ElementRef;
  @ViewChild('photoInput', { static: false }) photo: InputComponent;
  @ViewChild('descriptionInput', { static: false }) description: InputComponent;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  onSubmit(event){
    event.preventDefault();

    if(
      !this.title.inputValue ||
      !this.category.nativeElement.value ||
      !this.date.nativeElement.value ||
      !this.hour.nativeElement.value ||
      !this.min.nativeElement.value ||
      !this.description.inputValue
      ){
      alert('Please fill in all forms')
      return;
    }

    const hour = this.hour.nativeElement.value.trim();
    const min = this.min.nativeElement.value.trim();
    const date = this.date.nativeElement.value;
    const endDate = new Date(`${date}T${hour}:${min}:00.000Z`);

    this.data = {
      title: this.title.inputValue.trim(),
      description: this.description.inputValue.trim(),
      tags: [this.category.nativeElement.value, 'ws-wine'],
      endsAt: endDate.toString()
    }

    if(this.photo.inputValue){
      this.data.media = [this.photo.inputValue?.trim()];
    }

    console.log(this.data)

    alert('Do you want to post listing?');

    this.dataService.postListing(this.data).subscribe({
      next: (response: any) => {console.log(response)},
      error: (error: any) => {this.dataService.alertError(error)},
      complete: () => {console.log("listing added")}
    });
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.active = this.category.nativeElement.value ? true : false;
  }

}
