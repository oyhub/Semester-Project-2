import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {StorageService} from "./storage.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<boolean>(false);
  user$ = this.userSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.checkIfUserExist()
  }

  userLoggedIn(status: boolean) {
    this.userSubject.next(status);
  }

  checkIfUserExist(): void {
    if(!this.storageService.getUser() || this.storageService.getUser().length === 0) {
      this.userSubject.next(false);
    } else {
      this.userSubject.next(true);
    }
  }
}
