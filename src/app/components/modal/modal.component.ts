import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'ws-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  showModal: boolean = false;

  constructor(
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.modalService.showModal$.subscribe(show => this.showModal = show);
  }

  close() {
    this.modalService.closeModal();
  }

  clickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    console.log(targetElement)
    console.log(this.showModal)
    if (this.showModal && targetElement && targetElement.classList.contains('modal')) {
      this.modalService.closeModal();
    }
  }
}
