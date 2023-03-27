import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenWidthDetectionService {
  private mediumScreenThreshold: number = 769;
  private smallScreenThreshold: number = 400;
  private isSmallScreenSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isSmallScreen());
  private isMediumScreenSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isMediumScreen());

  constructor() {
    fromEvent(window, 'resize')
      .pipe(throttleTime(100))
      .subscribe((event: any) => {
        const currentWidth = event.currentTarget.innerWidth;
        this.isSmallScreenSubject.next(this.isSmallScreen(currentWidth));
        this.isMediumScreenSubject.next(this.isMediumScreen(currentWidth));
      });
  }

  isSmallScreen(width: number = window.innerWidth): boolean {
    return width < this.smallScreenThreshold;
  }

  isMediumScreen(width: number = window.innerWidth): boolean {
    return width > this.mediumScreenThreshold;
  }

  get smallScreen(): BehaviorSubject<boolean> {
    return this.isSmallScreenSubject;
  }

  get mediumScreen(): BehaviorSubject<boolean> {
    return this.isMediumScreenSubject;
  }
}
