import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import {forkJoin} from "rxjs";

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

  @ViewChild('headingH1') headingH1: ElementRef;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    forkJoin([
      this.dataService.getUserProfile(),
      this.dataService.getUsersListings(),
      this.dataService.getUsersBids()
    ]).subscribe({
      next: ([userProfile, userListings, userBids]: [any, any, any]) => {
        console.log(userProfile);
        console.log(userListings);
        console.log(userBids);
        this.listings = userListings;
        this.buildData(userProfile)
      },
      error: (error: any) => {
        console.log(error);
      }
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

}
