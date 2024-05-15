import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../Services/cart.service';
import { ICartData } from '../../../Models/CartInterfaces/ICartData';
import { DataServiceService } from '../../../Services/data-service.service';
import { WishService } from '../../../Services/wish.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent implements OnInit ,OnDestroy{
  @Input() product:any ="";
  cartCount:number=0;
  wishCount:number=0;
  role:any;
  cartSub:any;
  wishSub:any;
  roleSub:any;
  setSub:any;
  constructor( 
    public cartService:CartService,
    public wishService:WishService,
    public dataServ:DataServiceService,
    public router:Router,
    public activeRoute:ActivatedRoute) { }
  ngOnDestroy(): void {
    if(this.cartSub)this.cartSub.unsubscribe();
    if(this.wishSub)this.wishSub.unsubscribe();
    if(this.roleSub)this.roleSub.unsubscribe();
  }
  ngOnInit(): void {
    this.roleSub = this.dataServ.getRole().subscribe({
      next:(data)=>{
        this.role = data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  addToCart(id:number){
    this.cartService.addToCart({ProductId:id,Quantity:1}).subscribe({
      next:(data)=>{
        if(data==1){
          this.cartSub=this.dataServ.getCartCount().subscribe({
            next:(val)=>{
              this.cartCount=val??0;
              this.cartCount++;
              Swal.fire(
                'Success!',
                'Product added successfully!',
                'success'
              );
            },
            error:(err)=>{
              console.log(err);
            }
          })
          if(this.cartCount>0) this.dataServ.setCartCount(this.cartCount);
        }else{
          Swal.fire(
            'Success!',
            'Quantity Increment successfully!',
            'success'
          );
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  addToWish(id:number){
    this.wishService.addToWishList(id).subscribe({
      next:(data)=>{
        if(data==true){
          Swal.fire(
            'Found!',
            'Product added Before!',
            'warning'
          );
        }else{
          this.wishSub=this.dataServ.getWishCount().subscribe({
            next:(val)=>{
              this.wishCount=val??0;
              this.wishCount++;
              Swal.fire(
                'Success!',
                'Product added successfully!',
                'success'
              );
            },
            error:(err)=>{
              console.log(err);
            }
          })
          if(this.wishCount>0) this.dataServ.setWishCount(this.wishCount);
        }
      }, 
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
