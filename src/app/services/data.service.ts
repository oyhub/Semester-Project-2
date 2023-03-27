import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../app.constants';
import { Login } from '../models/login.model';
import { StorageService } from './storage.service';
import { retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  authUrl: string;

  constructor(
    private constants: Constants,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.authUrl = constants.BASE_URL + constants.URL_AUTH;
  }

  getAuth(login: Login): void {
    this.http
      .post(this.authUrl, login, httpOptions)
      .pipe(retry(2))
      .subscribe({
        next: (token: any) => {
          this.storageService.saveUser(token.user.username);
          this.storageService.saveToken(token.jwt);
        },
        error: (error: any) => {
          // Fix error
          console.error('Error occurred:', error);
        },
        complete: () => {
          console.log('complete');
        },
      });
  }
}
