import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'ws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  mobile: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.currentTarget.innerWidth >= 769) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
