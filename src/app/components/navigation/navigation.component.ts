import {Component, OnDestroy, OnInit} from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'ws-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  activeClass: boolean = false;
  isLoggedIn: boolean = false;
  isMediumScreen: boolean;
  private screenSubscription: Subscription;

  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService
  ) {}

  ngOnInit() {

    this.screenSubscription =
      this.screenWidthDetectionService.mediumScreen.subscribe((status: boolean) => {
        this.isMediumScreen = status;
        if (this.isMediumScreen === true) {
          this.activeClass = false;
        }
      })
    ;
  }

  ngOnDestroy() {
    this.screenSubscription.unsubscribe();
  }

  hamburgerClick() {
    this.activeClass = this.activeClass ? this.activeClass = false : this.activeClass = true;
  }

  onLeftClick() {
    console.log("Register")
  }

  onRightClick() {
    console.log("Login")
  }
}
