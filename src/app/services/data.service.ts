import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../app.constants';
import {Login} from '../models/login.model';
import { StorageService } from './storage.service';
import { retry } from 'rxjs/operators';
import {ModalService} from "./modal.service";
import {UserService} from "./user.service";
import {Register} from "../models/register.model";
import {Observable} from "rxjs";
import {CreateNew} from "../models/createNew.model";

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  loginUrl: string;
  registerUrl: string;
  listingsUrl: string;
  specificUrl: string;
  profileUrl: string;
  listingsLimit: number;
  showModal: boolean;

  constructor(
    private constants: Constants,
    private http: HttpClient,
    private storageService: StorageService,
    private modalService: ModalService,
    private userService: UserService
  ) {
    this.loginUrl = constants.BASE_URL + constants.LOGIN_URL;
    this.registerUrl = constants.BASE_URL + constants.REGISTER_URL;
    this.listingsUrl = constants.BASE_URL + constants.LISTINGS_URL + constants.LISTING_OPTIONS;
    this.specificUrl = constants.BASE_URL + constants.LISTINGS_URL;
    this.profileUrl = constants.BASE_URL + constants.PROFILE_URL;
    this.listingsLimit = constants.LISTINGS_LIMIT;

    this.modalService.showModal$.subscribe(show => this.showModal = show);
  }

  getAuth(login: Login): void{
    this.http
      .post(this.loginUrl, login, httpOptions)
      .pipe(retry(2))
      .subscribe({
        next: (response: any) => {
          this.storageService.saveUser(response.name);
          this.storageService.saveToken(response.accessToken);
          this.userService.userLoggedIn(true);
          console.log(response)
        },
        error: (error: any) => {
          // Fix error
          console.error('Error occurred:', error);
        },
        complete: () => {
          this.modalService.closeModal();
        },
      });
  }

  register(register: Register): void {
    this.http
      .post(this.registerUrl, register, httpOptions)
      .pipe(retry(1))
      .subscribe({
        next: (response: any) => {
          console.log(response)
        },
        error: (error: any) => {
          // Fix error
          console.error('Error occurred:', error);
        },
        complete: () => {
          this.modalService.closeModal();
        }
      });
  }

  getListings(offset: number = 0): Observable<any> {
    const listingsUrl = `${this.listingsUrl}&limit=${this.listingsLimit}&offset=${offset}&sort=created`;
    return this.http.get(listingsUrl, httpOptions).pipe(retry(2));
  }

  getSpecificListing(id: string): Observable<any> {
    const listingUrl = `${this.specificUrl}/${id}${this.constants.SPECIFIC_OPTIONS}`;
    return this.http.get(listingUrl, httpOptions).pipe(retry(2));
  }

  getUserProfile(): Observable<any> {
    const name = this.storageService.getUser()
    const token = this.storageService.getToken()
    const profileURL = this.profileUrl + '/' + name;

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.get(profileURL, httpOptions).pipe(retry(2));
  }

  getUsersListings(): Observable<any> {
    const name = this.storageService.getUser()
    const token = this.storageService.getToken()
    const userListingUrl = this.profileUrl + '/' + name + '/listings?_bids=true';

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.get(userListingUrl, httpOptions).pipe(retry(2));
  }

  getUsersBids(): Observable<any> {
    const name = this.storageService.getUser()
    const token = this.storageService.getToken()
    const userBidUrl = this.profileUrl + '/' + name + '/bids?_listings=true'

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.get(userBidUrl, httpOptions).pipe(retry(2));
  }

  postListing(listing: CreateNew): Observable<any> {
    const token = this.storageService.getToken()

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    return this.http.post(this.specificUrl, listing, httpOptions).pipe(retry(2));
  }

  bidOnListing(id: string, amount: any) {
    const token = this.storageService.getToken()
    const url = this.specificUrl + '/' + id + '/bids';

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    };
    console.log(id);
    console.log(amount);
    console.log(url);
    return this.http.post(url, amount, httpOptions).pipe(retry(2));
  }
}
