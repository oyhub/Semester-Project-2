import { Component, OnInit } from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';

@Component({
  selector: 'ws-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService
  ) {}

  ngOnInit(): void {}
}
