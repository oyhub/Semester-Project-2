import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ws-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() class: string;
  @Input() id: string;
  @Input() type: string;
  @Input() name: string;
  @Input() label: string;

  active: boolean = false;
  activeEye: boolean = false;
  inputValue: string;
  focused: boolean = false;
  showEye: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.type === 'password') {
      this.showEye = true;
    }
  }

  onFocus() {
    this.focused = true;
  }

  onBlur() {
    this.focused = false;
    this.active = this.inputValue ? true : false;
  }

  toggleEye() {
    this.activeEye = !this.activeEye;
    if (this.activeEye) {
      this.type = "text";
    } else {
      this.type = "password"
    }
  }
}
