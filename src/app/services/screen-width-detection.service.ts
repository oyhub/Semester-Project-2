import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenWidthDetectionService {
  private screenThreshold: number = 769;
  private isSmallScreenSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isSmallScreen());

  constructor() {
    fromEvent(window, 'resize')
      .pipe(throttleTime(100))
      .subscribe((event: any) => {
        this.isSmallScreenSubject.next(
          this.isSmallScreen(event.currentTarget.innerWidth)
        );
      });
  }

  isSmallScreen(width: number = window.innerWidth): boolean {
    return width > this.screenThreshold;
  }

  get screenStatus(): BehaviorSubject<boolean> {
    return this.isSmallScreenSubject;
  }
}
