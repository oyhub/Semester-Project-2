import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import { Constants } from '../../app.constants';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'ws-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {
  categoryListings: any[] = [];
  listings: any[] = [];
  listingOffset: number = 0;
  listingsLimit: number;
  moreToLoad: boolean = false;
  moreToLoadCategory: boolean = false;

  search = new FormControl;
  listingsToshow: any[];

  @ViewChild('category', {static: true}) category: ElementRef;
  @ViewChild('select', {static: true}) select: ElementRef;

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
    });
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

  getCategory(category) {
    this.dataService.getListingsByCat(category).subscribe({
      next: (response: any) => {
        this.categoryListings = [...this.categoryListings, ...response];
        this.listingsToshow = this.categoryListings;
      },
      error: (error: any) => {
        alert(error);
    }
    })
  }

  onGetCategory(event, fromSelect = false) {
    console.log(event)
    let category: string;
    if (fromSelect) {
      category = event;
    } else {
      category = event.target.getAttribute('data-category');
    }

    //Go through span's
    const categories = this.category.nativeElement.querySelectorAll('span');
    categories.forEach((cat) => {
      cat.classList.remove('active')
      if (category === cat.getAttribute('data-category')) {
        cat.classList.add('active')
      }
    });

    //Go through select
    this.select.nativeElement.value = category;
    const options = this.select.nativeElement.querySelectorAll('option');
    options.forEach((option) => {
      option.classList.remove('active');
      if (category === option.value) {
        option.classList.add('active')
      }
    })
    this.categoryListings = [];
    this.getCategory(category)
  }


  // onFocus() {
  //   this.focused = true;
  // }
  //
  // onBlur() {
  //   this.focused = false;
  //   this.active = this.form.controls['category'].value ? true : false;
  // }
  selectChange(event) {
    this.onGetCategory(event.target.value, true)
  }
}
