import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {Subscription} from "rxjs";
import {ScreenWidthDetectionService} from "../../services/screen-width-detection.service";

@Component({
  selector: 'ws-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  showModal: boolean = false;
  isMediumScreen: boolean;
  isSmallScreen: boolean;
  private screenSubscription: Subscription;

  constructor(
    private modalService: ModalService,
    public screenWidthDetectionService: ScreenWidthDetectionService
  ) { }

  ngOnInit(): void {
    this.modalService.showModal$.subscribe(show => this.showModal = show);

    this.screenSubscription =
      this.screenWidthDetectionService.mediumScreen.subscribe((status: boolean) => {
        this.isMediumScreen = status;
      })

    this.screenSubscription = this.screenWidthDetectionService.smallScreen.subscribe((status: boolean) => {
      this.isSmallScreen = status;
    });
  }

  close() {
    this.modalService.closeModal();
  }
}
