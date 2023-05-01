import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import { Constants } from '../../app.constants';
import {FormControl} from "@angular/forms";

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

  search = new FormControl;
  filterListings: any[];

  listingsToshow: any[];

  constructor(
    private dataService: DataService,
    private constants: Constants
  ) {
    this.listingsLimit = constants.LISTINGS_LIMIT
  }

  ngOnInit(): void {
    this.getListings();
    this.listingsToshow = this.listings;
    this.search.valueChanges.subscribe(value => {
      this.listingsToshow = this.listings.filter((listing) => {
        return listing.title.toLowerCase().includes(value.toLowerCase() ||
        listing.description.toLowerCase().includes(value.toLowerCase()))
      });
      if (!value) {
        this.listingsToshow = this.listings;
      }
    })
  }

  getListings(listingOffset: number = 0) {
    this.dataService.getListings(listingOffset).subscribe({
      next: (response: any) => {
        this.listings = [...this.listings, ...response];
        this.moreToLoad = this.listings.length % this.listingsLimit === 0;
        this.listingsToshow = this.listings;
      },
    error: (error: any) => {
        alert(error);
    }
    });
  }

  loadMore() {
    this.listingOffset = this.listingOffset + this.listingsLimit;
    this.getListings((this.listingOffset));
  }

}
