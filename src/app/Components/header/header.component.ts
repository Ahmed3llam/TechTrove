import { Component, Input, OnInit } from '@angular/core';
 import { DataServiceService } from './../../Services/data-service.service';
import { ILoginResponse, IUSerFromLogin } from '../../Models/UserInterfaces/ILoginResponse';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../Services/profile.service';
import { AccountService } from '../../Services/account.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
 
templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  // @Input() role:any="";
  role:any;
  cartCount:any;
  wishCount:any;
  token:any;
  data:any;
  userDataInfo:{fname:any,id:any}={fname:"",id:0};
  roleSubscription: any;
  userDataSubscription: any;
  cartSubscription: any;
  wishSubscription: any;
  tokenSubscription: any;
  actionSubscription:any;
  constructor(
    public dataService: DataServiceService,
    public userService:ProfileService,
    public logService:AccountService,
    public router:Router,
    public activeRoute:ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.userDataSubscription = this.dataService.getUserData().subscribe({
      next: (val) => {
        this.userDataInfo.fname = val?.firstName;
        this.userDataInfo.id = val?.id;
      },
      error: (err) => {
        console.log(err);
      },
    }
    );
    const userId = this.userDataInfo?.id;
    this.roleSubscription = this.dataService.getRole().subscribe({
      next: (val) => {
        this.role = val;
        console.log(this.role)
      },
      error: (err) => {
        console.log(err);
      },
    })
    this.cartSubscription = this.dataService.getCartCount().subscribe({
      next: (val) => {
        this.cartCount = val;
      },
      error: (err) => {
        console.log(err);
      },
    })
    this.wishSubscription = this.dataService.getWishCount().subscribe({
      next: (val) => {
        this.wishCount = val;
      },
      error: (err) => {
        console.log(err);
      },
    })
    this.tokenSubscription = this.dataService.getToken().subscribe({
      next: (val) => {
        this.token = val;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }
  logout() {
    this.actionSubscription = this.logService.logout().subscribe({
      next: (val) => {
        console.log(val);
        this.dataService.removeUserDataFromLocalStorage();
        this.userDataInfo={fname:"",id:0};
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
      },
    })
  }
  deleteAccount(id: string) {
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
        this.actionSubscription = this.userService.deleteUser(id).subscribe({
          next: (val) => {
            Swal.fire(
              'Deleted!',
              'Your Account has been deleted.',
              'success'
            );
            this.dataService.removeUserDataFromLocalStorage();
            this.userDataInfo={fname:"",id:0};
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.log(err);
          },
        })
      }
    });
  }
  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.wishSubscription) {
      this.wishSubscription.unsubscribe();
    }
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }
}
