import {Directive, HostListener, Input} from '@angular/core';
import {Router} from "@angular/router";

@Directive({
  selector: '[wsRefreshPage]'
})
export class RefreshPageDirective {
  @Input() routerLink: string;

  constructor(private router: Router) { }

  @HostListener('click', ['$event'])
  onClick(event) {
    const targetRoute = this.routerLink.startsWith('/') ? this.routerLink : '/' + this.routerLink;
    if (this.router.url === targetRoute) {
      event.preventDefault();
      location.reload();
    }
  }

}
