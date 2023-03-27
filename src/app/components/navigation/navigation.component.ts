import {Component, OnDestroy, OnInit} from '@angular/core';
import { ScreenWidthDetectionService } from 'src/app/services/screen-width-detection.service';
import {Subscription} from "rxjs";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'ws-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  activeClass: boolean = false;
  isLoggedIn: boolean = false;
  isMediumScreen: boolean;
  isSmallScreen: boolean;
  showModal: boolean = false
  private screenSubscription: Subscription;

  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService,
    private modalService: ModalService
  ) {
    this.modalService.showModal$.subscribe(show => this.showModal = show);
  }

  ngOnInit() {
    this.screenSubscription =
      this.screenWidthDetectionService.mediumScreen.subscribe((status: boolean) => {
        this.isMediumScreen = status;
        if (this.isMediumScreen === true) {
          this.activeClass = false;
        }
      })

    this.screenSubscription = this.screenWidthDetectionService.smallScreen.subscribe((status: boolean) => {
      this.isSmallScreen = status;
    });
  }

  ngOnDestroy() {
    this.screenSubscription.unsubscribe();
  }

  hamburgerClick() {
    this.activeClass = this.activeClass ? this.activeClass = false : this.activeClass = true;
  }

  onLeftClick() {
    console.log("Register")
    this.modalService.openModal();
  }

  onRightClick() {
    console.log("Login")
  }
}
