import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly BASE_URL = 'https://api.noroff.dev/api/v1/auction';
  public readonly REGISTER_URL = '/auth/register';
  public readonly LOGIN_URL = '/auth/login';
  public readonly LISTINGS_URL = '/listings?_bids=true&_active=true'
  public readonly LISTINGS_LIMIT = 10;


  public readonly TOKEN_KEY = 'token';
  public readonly USER_KEY = 'user';
}
