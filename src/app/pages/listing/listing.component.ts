import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../services/data.service";
import {differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, format} from "date-fns";
import {StorageService} from "../../services/storage.service";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'ws-wine',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  title: string;
  listing: any;
  image: string;
  id: string;
  noBidPlaced: boolean;
  bidValue: number;
  bidChanged: boolean = false;
  placeholderImage: boolean = false;
  highBid?: number;
  category: string;
  endDate: string;
  timeLeft: string;
  seller: string;
  creditsLeft: number;
  ended: boolean = false;
  user: string;
  latestBids: any;

  @ViewChild('bidInput', { static: false }) bidInput: ElementRef;

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private storageService: StorageService,
              private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.getSpecificListing(this.id).subscribe({
      next: (response: any) => {
        this.listing = response
        this.buildData(response);

      },
      error: (error: any) => {
        console.log(error);
      }
    });

    this.dataService.getUserProfile().subscribe({
      next: (response: any) => {
        this.addCoins(response)
      },
      error: (error: any) => {
        console.log(error)
      }
    });
  }

  buildData(listing) {
    this.image = listing.media[0];
    this.ended = new Date() > new Date(listing.endsAt)

    if (!this.image) {
      this.placeholderImage = true;
      this.image = "assets/images/wine-bottle-placeholder.jpg"
    }

    this.category = this.categoryService.getCategory(listing.tags);
    this.noBidPlaced = listing.bids.length === 0;
    this.highBid = listing.bids?.slice(-1)[0]?.amount;
    this.endDate = format(new Date(listing.endsAt), 'MMMM d. yyyy');
    this.timeLeft = this.getRemainingTime(listing.endsAt);
    this.seller = listing.seller.name.replace(/_/g, " ");
    this.title = this.formatTitle(listing.title);

    this.bidValue = 10;
    if(this.highBid) {
      this.bidValue = this.highBid + 10;
    }

    this.latestBids = listing.bids.slice(-3).reverse();
  }

  imageLoadError(): void {
    this.image = "assets/images/wine-bottle-placeholder.jpg"
  }

  resetValue(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (parseInt(inputElement.value) === this.bidValue && !this.bidChanged) {
      inputElement.value = "";
      this.bidChanged = true;
    }
  }

  getRemainingTime(endDate: string): string {
    const now = new Date();
    const end = new Date(endDate);
    const days = differenceInDays(end, now);
    const months = differenceInMonths(end, now);
    const hours = differenceInHours(end, now);
    const minutes = differenceInMinutes(end, now);

    const condition = months > 0
      ? 'months'
      : days > 0
        ? 'days'
        : hours > 0
          ? 'hours'
          : minutes > 0
            ? 'minutes'
            : 'ended';

    switch (condition) {
      case 'months':
        return `${months} month${months > 1 ? 's' : ''} left`;
      case 'days':
        return `${days} day${days > 1 ? 's' : ''} left`;
      case 'hours':
        return `${hours} hour${hours > 1 ? 's' : ''} left`;
      case 'minutes':
        return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
      case 'ended':
      default:
        return 'Auction ended';
    }
  }

  formatTitle(string: string): string {
    if (this.hasMixedCase(string)) {
      return string;
    } else {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    }
  }

  hasMixedCase(string: string): boolean {
    return /[a-z]/.test(string) && /[A-Z]/.test(string);
  }

  private addCoins(user) {
    this.creditsLeft = user.credits;
  }

  onBid() {
    const bid = parseInt(this.bidInput.nativeElement.value.trim());

    if(!bid || isNaN(bid)){
    alert('Please place a valid bid');
    return
    }

    if(bid <= this.highBid) {
      alert('Bid must be higher than existing bid')
      return;
    }

    const bidToSend = {
      "amount": bid
    }

    this.dataService.bidOnListing(this.id, bidToSend).subscribe({
      next: () => {},
      error: (error: any) => {this.dataService.alertError(error)},
      complete: () => {console.log("bid added")}
    });
  }

  bidderName(bid: any) {
    return this.formatTitle(bid.bidderName.replace(/_/g, " "));
  }
}
