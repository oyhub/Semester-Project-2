import { Component, OnInit } from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';

@Component({
  selector: 'ws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService
  ) {}

  ngOnInit(): void {}
}
