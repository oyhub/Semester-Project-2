import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ws-double-button',
  templateUrl: './double-button.component.html',
  styleUrls: ['./double-button.component.scss']
})
export class DoubleButtonComponent implements OnInit {

  @Input() leftText: string;
  @Input() rightText: string;
  @Output() leftClick = new EventEmitter<void>();
  @Output() rightClick = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }


  onLeftClick() {
    this.leftClick.emit();
  }

  onRightClick() {
    this.rightClick.emit();
  }
}
