import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../services/data.service";
import {differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, format} from "date-fns";
import {StorageService} from "../../services/storage.service";
import {CategoryService} from "../../services/category.service";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ValidationService} from "../../services/validation.service";

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

  bidForm: FormGroup;
  bidValidationMessage: any;


  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private storageService: StorageService,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private validationService: ValidationService) { }

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

    this.bidForm = this.formBuilder.group({
      bidInput: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    })

    this.validationService.setValidationMessages({
      bidInput: {
        required: 'You need to fill in a value to bid',
        pattern: 'Bids need to be a number',
        notEnoughCredit: 'You do not have enough credits to bid on this',
        bidToLow: 'The bid needs to be higher than existing bid'
      }
    });

    this.bidValidationMessage = this.validationService.resetValidationMessages(this.bidForm);

    this.validationService.trackFieldChanges(this.bidForm, (fieldName, validationMessage) => {
      this.bidValidationMessage[fieldName] = validationMessage;
    })
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

    this.bidForm.controls['bidInput'].setValue(10);
    if(this.highBid) {
      this.bidForm.controls['bidInput'].setValue(this.highBid + 10);
    }

    this.latestBids = listing.bids.slice(-3).reverse();

    this.updateValidators()
  }

  updateValidators() {
    this.bidForm.controls['bidInput'].setValidators([
      Validators.required,
      Validators.pattern(/^\d+$/),
      bidToLow(this.highBid),
      notEnoughCredit(this.creditsLeft, this.highBid)
    ]);

    this.bidForm.controls['bidInput'].updateValueAndValidity();
  }

  imageLoadError(): void {
    this.image = "assets/images/wine-bottle-placeholder.jpg"
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
    this.updateValidators()
  }

  onBid() {
    if (this.bidForm.status === 'INVALID'){
      this.bidValidationMessage = this.validationService.getValidationMessages(this.bidForm);
      return
    }

    const bid = {
      "amount": this.bidForm.controls['bidInput'].value
    }

    this.dataService.bidOnListing(this.id, bid).subscribe({
      next: () => {},
      error: (error: any) => this.dataService.alertError(error),
      complete: () => alert('bid added')
    });
  }

  bidderName(bid: any) {
    return this.formatTitle(bid.bidderName.replace(/_/g, " "));
  }
}

// Custom validators
function notEnoughCredit(credits: any, highBid: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (credits < highBid || control.value < highBid) {
      return {'notEnoughCredit': true}
    }
    return null;
  };
}

function bidToLow(highBid: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (control.value < highBid) {
      return { 'bidToLow': true }
    }
    return null;
  };
}
