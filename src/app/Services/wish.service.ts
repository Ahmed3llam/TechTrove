import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IWish } from '../Models/WishInterfaces/IWish';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishService {
  apiUrl: string = 'http://localhost:37667/api/Wishes';
  constructor(private http: HttpClient) { }
  getWishes(): Observable<IWish> {
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.get<IWish>(this.apiUrl, options);
  }
  addToWishList(productId: number){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.post(this.apiUrl, { ProductId: productId }, options);
  }

  deleteWishItem(id: number){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.delete(`${this.apiUrl}/${id}`, options);
  }

  deleteAllWishes(){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.delete(this.apiUrl, options);
  }
}
