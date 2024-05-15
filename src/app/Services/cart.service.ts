import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICartData } from '../Models/CartInterfaces/ICartData';
import { Observable } from 'rxjs';
import { ICart } from '../Models/CartInterfaces/ICart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl: string = 'http://localhost:37667/api/CartItems';

  constructor(private http: HttpClient) { }

  getCartItems():Observable<ICart> {
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.get<ICart>(this.apiUrl, options);
  }
  incrementQuantity(id: number){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.put(`${this.apiUrl}/Increment/${id}`, {}, options);
  }
  decrementQuantity(id: number){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.put(`${this.apiUrl}/Decrement/${id}`, {}, options);
  }

  addToCart(cart: ICartData){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.post(this.apiUrl, cart, options);
  }

  deleteCartItem(id: number){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.delete(`${this.apiUrl}/${id}`, options);
  }

  deleteAllCartItems(){
    let token = localStorage.getItem('token');
    let options = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) };
    return this.http.delete(this.apiUrl, options);
  }
}
