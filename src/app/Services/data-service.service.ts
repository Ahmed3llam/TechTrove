import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUSerFromLogin } from '../Models/UserInterfaces/ILoginResponse';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private userDataSubject = new BehaviorSubject<IUSerFromLogin | null>(JSON.parse(localStorage.getItem('userData') || '{}'));
  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private cartCountSubject = new BehaviorSubject<number | null>(JSON.parse(localStorage.getItem('cartCount') || '0'));
  private wishCountSubject = new BehaviorSubject<number | null>(JSON.parse(localStorage.getItem('wishCount') || '0'));

  constructor() {}

  public SetData(userData: IUSerFromLogin, token: string, role: string, cartCount: number, wishCount: number): void {
    this.setUserData(userData);
    this.setToken(token);
    this.setRole(role);
    this.setCartCount(cartCount);
    this.setWishCount(wishCount);
  }

  public setUserData(userData: IUSerFromLogin): void {
    localStorage.setItem('userData', JSON.stringify(userData));
    this.userDataSubject.next(userData);
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  public setRole(role: string): void {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  public setCartCount(cartCount: number): void {
    localStorage.setItem('cartCount', JSON.stringify(cartCount));
    this.cartCountSubject.next(cartCount);
  }

  public setWishCount(wishCount: number): void {
    localStorage.setItem('wishCount', JSON.stringify(wishCount));
    this.wishCountSubject.next(wishCount);
  }

  public getUserData(): Observable<IUSerFromLogin | null>{
    return this.userDataSubject.asObservable();
    // return JSON.parse(localStorage.getItem('userData') || '{}');
  }

  public getRole(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  public getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  public getCartCount(): Observable<number | null> {
    return this.cartCountSubject.asObservable();
  }

  public getWishCount(): Observable<number | null> {
    return this.wishCountSubject.asObservable();
  }

  public removeUserDataFromLocalStorage(): void {
    this.removeUserData();
    this.removeToken();
    this.removeRole();
    this.removeCartCount();
    this.removeWishCount();
  }

  public removeCartCount(): void {
    localStorage.removeItem('cartCount');
    this.cartCountSubject.next(null);
  }

  public removeWishCount(): void {
    localStorage.removeItem('wishCount');
    this.wishCountSubject.next(null);
  }

  public removeUserData(): void {
    localStorage.removeItem('userData');
  }

  public removeRole(): void {
    localStorage.removeItem('role');
    this.roleSubject.next(null);
  }

  public removeToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}