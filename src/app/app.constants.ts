import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly BASE_URL = 'https://winebase.up.railway.app/api/';
  public readonly URL_AUTH = 'auth/local/';
  public readonly WINES_URL = 'wines/';
  public readonly ALL_DATA = '?populate=*';

  public readonly TOKEN_KEY = 'token';
  public readonly USER_KEY = 'user';
}
