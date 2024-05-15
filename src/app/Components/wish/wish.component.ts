import { Component, OnDestroy, OnInit } from '@angular/core';
import { WishService } from '../../Services/wish.service';
import { IWish, IWishArray } from '../../Models/WishInterfaces/IWish';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataServiceService } from '../../Services/data-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wish',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './wish.component.html',
  styleUrl: './wish.component.css'
})
export class WishComponent implements OnInit,OnDestroy {
  products: IWishArray[] = [];
  wishCount: number = 0;
  WishSub:any;
  deleteSub:any;
  countSub:any;
  constructor(public wishService: WishService,public dataService:DataServiceService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.WishSub = this.wishService.getWishes().subscribe({
      next: (response: IWish) => {
        this.products = response?.$values;
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
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
        this.deleteSub = this.wishService.deleteWishItem(id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id!= id);
            this.countSub = this.dataService.getWishCount().subscribe({
              next: (val) => {
                this.wishCount = val??0;
                this.wishCount--;
                Swal.fire(
                  'Deleted!',
                  'this item has been deleted From your wish list.',
                  'success'
                );
              },
              error: (err) => {
                console.log(err);
              }
            })
            this.dataService.setWishCount(this.wishCount);
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }
  ngOnDestroy(): void {
    if(this.WishSub) this.WishSub.unsubscribe();
    if(this.deleteSub) this.deleteSub.unsubscribe();
  }
}
