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
  loginModal: boolean = false;
  registerModal: boolean = false;
  showModal: boolean = false
  private screenSubscription: Subscription;

  constructor(
    public screenWidthDetectionService: ScreenWidthDetectionService,
    private modalService: ModalService
  ) {
      this.modalService.showModal$.subscribe((show) => {
      this.showModal = show
      if (!this.showModal) {
        this.loginModal = false;
        this.registerModal = false;
        console.log("false ff");
      }
    });
  }



  ngOnInit(): void {
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

  registerClick() {
    this.registerModal = true;
    this.activeClass = this.activeClass ? !this.activeClass : undefined;
    console.log("Register")
    this.modalService.openModal();
  }

  loginClick() {
    this.loginModal = true;
    this.activeClass = this.activeClass ? !this.activeClass : undefined;
    console.log("Login")
    this.modalService.openModal();
  }
}
