import { Injectable } from '@angular/core';
import { Constants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private constants: Constants) { }

  private saveToStorage(key: string, value:string): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  private getFromStorage(key: string): string | [] {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : [];
  }

  public saveUser(user: string): void {
    this.saveToStorage(this.constants.USER_KEY, user)
  }

  public getUser(): any {
    const user = this.getFromStorage(this.constants.USER_KEY)

    return user ? user : null;
  }

  public saveToken(token: string): void {
    this.saveToStorage(this.constants.TOKEN_KEY, token)
  }

  public getToken(){
    return this.getFromStorage(this.constants.TOKEN_KEY);
  }

  public clearStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
