import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'ws-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getListings();
  }

  getListings() {
    this.dataService.getListings().subscribe({
      next: (response: any) => {
        console.log(response);
        this.listings = response;
      },
    error: (error: any) => {
        console.log(error);
    }
    });
  }

}
