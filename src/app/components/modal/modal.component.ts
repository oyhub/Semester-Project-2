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
}
