import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  getCategory(tags: string[]): string {
    const tagToCategoryMap = {
      'ws-red': 'Red',
      'ws-white': 'White',
      'ws-rose': 'Rosé',
      'ws-dessert': 'Dessert',
      'ws-champagne': 'Champagne',
      'ws-sparkling': 'Other sparkling',
    };

    const matchingTag = tags.find(tag => tagToCategoryMap.hasOwnProperty(tag));

    return matchingTag ? tagToCategoryMap[matchingTag] : 'Category not found';
  }

}
