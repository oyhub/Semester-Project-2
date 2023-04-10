import {Component, Input, OnInit} from '@angular/core';
import {differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths} from 'date-fns';

@Component({
  selector: 'ws-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  title: string;
  highBid?: number;
  image: string;
  endTime: string;
  description: string;
  placeholderImage: boolean = false;

  @Input() item: any;

  constructor() { }

  ngOnInit(): void {
    this.title = this.formatTitle(this.item.title);
    this.image = this.item.media[0];
    this.endTime = this.getRemainingTime(this.item.endsAt);
    this.highBid = this.item.bids?.slice(-1)[0]?.amount;
    this.description = this.item.description;

    if (!this.image) {
      this.placeholderImage = true;
      this.image = "assets/images/wine-bottle-placeholder.jpg"
    }
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
}
