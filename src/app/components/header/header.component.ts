import { Component, OnInit } from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'ws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isMediumScreen: boolean;
  isSmallScreen: boolean;
  private screenSubscription: Subscription;
  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService
  ) {}

  ngOnInit(): void {
    this.screenSubscription =
      this.screenWidthDetectionService.mediumScreen.subscribe((status: boolean) => {
        this.isMediumScreen = status;
      })

    this.screenSubscription = this.screenWidthDetectionService.smallScreen.subscribe((status: boolean) => {
      this.isSmallScreen = status;
    });
  }
}
