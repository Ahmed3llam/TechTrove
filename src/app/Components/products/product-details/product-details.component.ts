import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Services/product.service';
import { CartService } from '../../../Services/cart.service';
import { WishService } from '../../../Services/wish.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ICartData } from '../../../Models/CartInterfaces/ICartData';
import { FormsModule } from '@angular/forms';
import { DataServiceService } from '../../../Services/data-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  paramSub:any;
  productSub:any;
  CartSub:any;
  WishSub:any;
  ProductId:number = 0;
  Product: any = {};
  cartCount: number = 0;
  wishCount: number = 0;
  selectedQuantity: number = 1;
  role:string = "";
  cartSub:any;
  wishSub:any;
  roleSub:any;
  constructor(
    public prodServ:ProductService,
    public cartServ:CartService,
    public dataServ:DataServiceService,
    public wish:WishService,
    public router:Router,
    public activeRoute:ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.roleSub = this.dataServ.getRole().subscribe({
      next:(data)=>{
        this.role = data??"";
      },
    })
    this.paramSub = this.activeRoute.params.subscribe({
      next:(data)=>{
        this.ProductId = data['id'];
      }
    })
    this.productSub = this.prodServ.getProduct(this.ProductId).subscribe({
      next: (response) => {
        this.Product = response;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  onQuantityChange(): void {
    console.log('Selected Quantity:', this.selectedQuantity);
  }
  addToCart(){
    this.CartSub = this.cartServ.addToCart({ProductId:this.ProductId,Quantity:this.selectedQuantity}).subscribe({
      next:(data)=>{
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
        this.dataServ.setCartCount(this.cartCount);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  addToWishList(){
    this.WishSub = this.wish.addToWishList(this.ProductId).subscribe({
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
          this.dataServ.setWishCount(this.wishCount);
        }
      }, 
      error:(err)=>{
        console.log(err);
      }
    })
  }
  ngOnDestroy(): void {
    if(this.paramSub) this.paramSub.unsubscribe();
    if(this.productSub) this.productSub.unsubscribe();
    if(this.CartSub) this.CartSub.unsubscribe();
    if(this.WishSub) this.WishSub.unsubscribe();
    if(this.roleSub) this.roleSub.unsubscribe();
    if(this.cartSub) this.cartSub.unsubscribe();
    if(this.wishSub) this.wishSub.unsubscribe();
  }
}
