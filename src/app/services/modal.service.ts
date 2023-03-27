import { Injectable } from '@angular/core';
import {Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private showModalSubject = new Subject<boolean>();
  public showModal$ = this.showModalSubject.asObservable();

  constructor() { }

  openModal() {
    this.showModalSubject.next(true);
  }

  closeModal() {
    this.showModalSubject.next(false);
    console.log("close modal")
  }
}
