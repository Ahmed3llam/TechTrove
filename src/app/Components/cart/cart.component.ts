import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { ICart, ICartArray } from '../../Models/CartInterfaces/ICart';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataServiceService } from '../../Services/data-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit,OnDestroy {
  products: ICartArray[] = [];
  cartCount: number = 0;
  total: number = 0;
  CartSub:any;
  addSub:any;
  subSub:any;
  deleteSub:any;
  countSub:any;
  constructor(public cartService: CartService,public dataService:DataServiceService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.CartSub = this.cartService.getCartItems().subscribe({
      next: (response: ICart) => {
        this.products = response?.cartDto?.$values;
        this.total = response?.totalPrice;
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
  decrementQuantity(id: number) {
    this.subSub = this.cartService.decrementQuantity(id).subscribe({
      next: () => {
        this.fetchProducts();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  incrementQuantity(id: number) {
    this.addSub = this.cartService.incrementQuantity(id).subscribe({
      next: () => {
        this.fetchProducts();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  removeItem(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSub = this.cartService.deleteCartItem(id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id!= id);
            this.countSub = this.dataService.getCartCount().subscribe({
              next: (val) => {
                this.cartCount = val??0;
                this.cartCount--;
                Swal.fire(
                  'Deleted!',
                  'This item has been deleted From your cart.',
                  'success'
                );
              },
              error: (err) => {
                console.log(err);
              }
            })
            this.dataService.setCartCount(this.cartCount);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }
  ngOnDestroy(): void {
    if(this.CartSub) this.CartSub.unsubscribe();
    if(this.addSub) this.addSub.unsubscribe();
    if(this.subSub) this.subSub.unsubscribe();
    if(this.deleteSub) this.deleteSub.unsubscribe();
    if(this.countSub) this.countSub.unsubscribe();
  }
}
