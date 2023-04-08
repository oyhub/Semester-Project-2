import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import { Constants } from '../../app.constants';

@Component({
  selector: 'ws-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];
  listingOffset: number = 0;
  listingsLimit: number;
  moreToLoad: boolean = false;

  constructor(
    private dataService: DataService,
    private constants: Constants
  ) {
    this.listingsLimit = constants.LISTINGS_LIMIT
  }

  ngOnInit(): void {
    this.getListings();
  }

  getListings(listingOffset: number = 0) {
    this.dataService.getListings(listingOffset).subscribe({
      next: (response: any) => {
        this.listings = [...this.listings, ...response];
        this.moreToLoad = this.listings.length % this.listingsLimit === 0;
      },
    error: (error: any) => {
        console.log(error);
    }
    });
  }

  loadMore() {
    this.listingOffset = this.listingOffset + 10;
    this.getListings((this.listingOffset));
  }

}
