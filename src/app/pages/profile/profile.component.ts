import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import { forkJoin, map, Observable, of} from "rxjs";
import {InputComponent} from "../../components/inputs/input.component";
import {Avatars} from "../../models/avatars.model";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";

@Component({
  selector: 'ws-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  listings: any;
  wins: any;

  credits: number;
  username: string;
  avatar: string;
  avatars: Avatars[];
  activeAvatar: any;
  avatarFormFromUrl: FormGroup;
  localAvatarError: boolean = false;

  @ViewChild('headingH1') headingH1: ElementRef;
  @ViewChild('imageInput', { static: false }) imageInput: InputComponent;

  validationMessage: any;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private validationService: ValidationService) { }

  ngOnInit(): void {
    forkJoin([
      this.dataService.getUserProfile(),
      this.dataService.getUsersListings(),
      this.dataService.getUsersBids()
    ]).subscribe({
      next: ([userProfile, userListings, userBids]: [any, any, any]) => {
        this.listings = userListings;

        this.buildData(userProfile)
        this.buildWins(userProfile, userBids).subscribe({
          next: (wins) => { this.wins = wins },
          error: (error: any) => { console.log(error);}
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });

    this.avatars = [
      { src: "assets/images/avatar-people/01.png", alt: "Avatar 1" },
      { src: "assets/images/avatar-people/02.png", alt: "Avatar 2" },
      { src: "assets/images/avatar-people/03.png", alt: "Avatar 3" },
      { src: "assets/images/avatar-people/04.png", alt: "Avatar 4" },
      { src: "assets/images/avatar-people/05.png", alt: "Avatar 5" },
      { src: "assets/images/avatar-people/06.png", alt: "Avatar 6" },
      { src: "assets/images/avatar-people/07.png", alt: "Avatar 7" },
      { src: "assets/images/avatar-people/08.png", alt: "Avatar 8" },
      { src: "assets/images/avatar-people/09.png", alt: "Avatar 9" }
    ];

    this.avatarFormFromUrl = this.formBuilder.group({
      avatarFromUrl: ['', [Validators.required, Validators.pattern('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$')]],
    });

    this.validationService.setValidationMessages({
      avatarFromUrl: {
        required: 'A URL is required',
        pattern: 'Please make sure the input is a avalid URL'
      }
    });

    this.validationMessage = this.validationService.resetValidationMessages(this.avatarFormFromUrl);

    this.validationService.trackFieldChanges(this.avatarFormFromUrl, (fieldName, validationMessage) => {
      this.validationMessage[fieldName] = validationMessage;
    });
  }

  getCurrentPrice(listing) {
    return listing.bids?.slice(-1)[0]?.amount ? listing.bids?.slice(-1)[0]?.amount : 0;
  }

  getAmountOfBids(listing) {
    return listing.bids?.length
  }

  buildData(profile) {
    this.username = profile.name.replace(/_/g, " ");
    this.avatar = profile.avatar ? profile.avatar : "assets/images/avatar-people/01.png";
    this.credits = profile.credits;
  }

  buildWins(profile, bids): Observable<any[]> {
    if (!profile.wins) {
      return of([]);
    }

    const winObservables = profile.wins.map(win => {
      return bids
        .filter(bid => win === bid.listing.id)
        .map(bid => {
          return this.dataService.getSpecificListing(bid.listing.id).pipe(
            map(thisBid => {
              return { ...bid, amountOfBids: thisBid.bids.length };
            })
          );
        });
    }).flat();

    return forkJoin(winObservables) as Observable<any[]>;
  }

  updateAvatar() {
    if (this.avatarFormFromUrl.status === 'INVALID'){
      this.validationMessage = this.validationService.getValidationMessages(this.avatarFormFromUrl);
      return
    }
    this.dataService.updateAvatar(this.avatarFormFromUrl.controls['avatarFromUrl'].value).subscribe({
      next: (response: any) => alert('Avatar image updated'),
      error: (error: any) => this.dataService.alertError(error)
    });
  }

  updateLocalAvatar() {
    this.localAvatarError = false;
    if (!this.activeAvatar) {
      this.localAvatarError = true;
      return
    }
    this.dataService.updateAvatar(this.activeAvatar.src).subscribe({
      next: (response: any) => alert('Avatar image updated'),
      error: (error: any) => this.dataService.alertError(error)
    });

  }

  setActiveAvatar(avatar) {
    this.activeAvatar = avatar;
  }
}
